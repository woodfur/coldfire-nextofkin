use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use anchor_lang::solana_program::system_instruction;

declare_id!("H6ETDMJrcvhaJnYBEbTkSLjFQbrKTucQvMBPCKh8qpG8");

#[program]
pub mod dead_mans_switch {
    use super::*;

    pub fn create_plan(
        ctx: Context<CreatePlan>,
        name: String,
        description: String,
        plan_type: PlanType,
        beneficiary: Pubkey,
        asset: Pubkey,
        allocation: u64,
        inactivity_period: i64
    ) -> Result<()> {
        let plan = &mut ctx.accounts.plan;
        let switch = &mut ctx.accounts.switch;
        let owner = &ctx.accounts.owner;

        plan.owner = owner.key();
        plan.name = name;
        plan.description = description;
        plan.plan_type = plan_type;
        plan.beneficiary = beneficiary;
        plan.asset = asset;
        plan.allocation = allocation;
        plan.created_at = Clock::get()?.unix_timestamp;
        plan.switch = switch.key();

        switch.owner = owner.key();
        switch.beneficiary = beneficiary;
        switch.last_check_in = Clock::get()?.unix_timestamp;
        switch.switch_delay = inactivity_period;

        emit!(PlanCreated {
            owner: plan.owner,
            plan_id: plan.key(),
            name: plan.name.clone(),
            plan_type: plan.plan_type,
            asset: plan.asset,
            beneficiary: plan.beneficiary,
        });

        emit!(SwitchInitialized {
            owner: switch.owner,
            beneficiary: switch.beneficiary,
            switch_delay: switch.switch_delay,
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

        let transfer_amount = ctx.accounts.owner.lamports();
        let transfer_instruction = system_instruction::transfer(
            &ctx.accounts.owner.key(),
            &ctx.accounts.beneficiary.key(),
            transfer_amount
        );

        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.owner.to_account_info(),
                ctx.accounts.beneficiary.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        emit!(SwitchExecuted {
            beneficiary: switch.beneficiary,
            timestamp: current_time,
            amount_transferred: transfer_amount,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePlan<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + // discriminator
        32 + // owner: Pubkey
        (4 + 64) + // name: String (4 bytes for length + max 64 bytes for content)
        (4 + 256) + // description: String (4 bytes for length + max 256 bytes for content)
        1 + // plan_type: PlanType (enum)
        32 + // beneficiary: Pubkey
        32 + // asset: Pubkey
        8 + // allocation: u64
        8 + // created_at: i64
        32 + // switch: Pubkey
        200 // extra space for future updates
    )]
    pub plan: Account<'info, Plan>,
    #[account(
        init,
        payer = owner,
        space = 8 + // discriminator
        32 + // owner: Pubkey
        32 + // beneficiary: Pubkey
        8 + // last_check_in: i64
        8 // switch_delay: i64
    )]
    pub switch: Account<'info, DeadMansSwitch>,
    #[account(mut)]
    pub owner: Signer<'info>,
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
    #[account(mut)]
    /// CHECK: We're transferring from this account
    pub owner: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct DeadMansSwitch {
    pub owner: Pubkey,
    pub beneficiary: Pubkey,
    pub last_check_in: i64,
    pub switch_delay: i64,
}

#[account]
#[derive(Default)]
pub struct Plan {
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
    pub plan_type: PlanType,
    pub beneficiary: Pubkey,
    pub asset: Pubkey,
    pub allocation: u64,
    pub created_at: i64,
    pub switch: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Default)]
pub enum PlanType {
    #[default]
    Inheritance,
    Emergency,
    Business,
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
    pub amount_transferred: u64,
}

#[event]
pub struct PlanCreated {
    pub owner: Pubkey,
    pub plan_id: Pubkey,
    pub name: String,
    pub plan_type: PlanType,
    pub asset: Pubkey,
    pub beneficiary: Pubkey,
}