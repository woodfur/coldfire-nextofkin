use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

declare_id!("GxpMKCELhKsaEAn6dhHwSw2JrNF5DXDyyfYo3zWibdvQ");

#[program]
pub mod dead_mans_switch {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        switch_delay: i64,
    ) -> Result<()> {
        require!(switch_delay > 0, DeadMansSwitchError::InvalidSwitchDelay);

        let switch = &mut ctx.accounts.switch;
        switch.owner = ctx.accounts.owner.key();
        switch.beneficiary = ctx.accounts.beneficiary.key();
        switch.last_check_in = Clock::get()?.unix_timestamp;
        switch.switch_delay = switch_delay;

        emit!(SwitchInitialized {
            owner: switch.owner,
            beneficiary: switch.beneficiary,
            switch_delay,
        });

        Ok(())
    }

    pub fn check_in(ctx: Context<CheckIn>) -> Result<()> {
        let switch = &mut ctx.accounts.switch;
        let current_time = Clock::get()?.unix_timestamp;
        
        switch.last_check_in = current_time;

        emit!(CheckedIn {
            owner: switch.owner,
            timestamp: current_time,
        });

        Ok(())
    }

    pub fn execute_switch(ctx: Context<ExecuteSwitch>) -> Result<()> {
        let switch = &ctx.accounts.switch;
        let current_time = Clock::get()?.unix_timestamp;
        
        require!(
            current_time - switch.last_check_in >= switch.switch_delay,
            DeadMansSwitchError::SwitchNotTriggered
        );

        // Transfer funds logic would go here
        // For this example, we're just closing the account

        emit!(SwitchExecuted {
            beneficiary: switch.beneficiary,
            timestamp: current_time,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 32 + 8 + 8
    )]
    pub switch: Account<'info, DeadMansSwitch>,
    #[account(mut)]
    pub owner: Signer<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub beneficiary: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CheckIn<'info> {
    #[account(
        mut,
        has_one = owner @ DeadMansSwitchError::UnauthorizedOwner
    )]
    pub switch: Account<'info, DeadMansSwitch>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct ExecuteSwitch<'info> {
    #[account(
        mut,
        has_one = beneficiary @ DeadMansSwitchError::UnauthorizedBeneficiary,
        close = beneficiary
    )]
    pub switch: Account<'info, DeadMansSwitch>,
    #[account(mut)]
    pub beneficiary: Signer<'info>,
}

#[account]
pub struct DeadMansSwitch {
    pub owner: Pubkey,
    pub beneficiary: Pubkey,
    pub last_check_in: i64,
    pub switch_delay: i64,
}

#[error_code]
pub enum DeadMansSwitchError {
    #[msg("Switch delay must be greater than zero")]
    InvalidSwitchDelay,
    #[msg("Not enough time has passed to execute the switch")]
    SwitchNotTriggered,
    #[msg("Only the owner can check in")]
    UnauthorizedOwner,
    #[msg("Only the beneficiary can execute the switch")]
    UnauthorizedBeneficiary,
}

#[event]
pub struct SwitchInitialized {
    pub owner: Pubkey,
    pub beneficiary: Pubkey,
    pub switch_delay: i64,
}

#[event]
pub struct CheckedIn {
    pub owner: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct SwitchExecuted {
    pub beneficiary: Pubkey,
    pub timestamp: i64,
}