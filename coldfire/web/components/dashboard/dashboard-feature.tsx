'use client';

import { AppHero } from '../ui/ui-layout';

const links: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  {
    label: 'Solana Developers GitHub',
    href: 'https://github.com/solana-developers/',
  },
];

export default function DashboardFeature() {
  return (
    <div className="flex overflow-hidden flex-col justify-center items-center bg-gray-100">
      
      
      <div className="flex relative flex-col mt-24 w-full max-md:mt-10 max-md:max-w-full">
        <div className="flex absolute z-0 max-w-full bottom-[75px] h-[988px] min-h-[988px] right-[140px] w-[1160px]" />
        <div className="flex z-0 flex-col justify-center items-center w-full max-md:max-w-full">
          <div className="self-stretch text-lg font-medium text-center text-neutral-500 text-opacity-90 max-md:max-w-full">
            Ensure your digital assets are passed on according to your wishes
          </div>
          <div className="mt-8 text-7xl font-bold text-black justify-center  w-[652px] max-md:max-w-full max-md:text-4xl max-md:leading-10">
          Secure your crypto Legacy
          </div>
          <div className="flex flex-wrap gap-8 justify-center items-start mt-8 max-md:max-w-full">
            <div className="flex flex-col justify-center items-center p-4 text-lg font-bold leading-none text-right text-white bg-blue-400 rounded-xl min-h-[56px] w-[130px]">
              <div className="gap-2.5 self-stretch">Get started</div>
            </div>
            <div className="flex flex-col justify-center p-4 rounded-xl border-2 border-blue-400 border-solid min-h-[56px] w-[232px]">
              <div className="flex gap-2.5 justify-center items-center w-full">
                <div className="flex gap-2.5 justify-center items-center self-stretch my-auto w-[18px]">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/f3e641ce1aff465fb0ae0be3e016d5688ead4cfba1046366835985114552f65d?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                    className="object-contain self-stretch my-auto aspect-square w-[18px]"
                  />
                </div>
                <div className="self-stretch my-auto text-lg font-bold leading-none text-right text-zinc-900">
                  Watch free demo
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex overflow-hidden z-0 flex-wrap gap-1 justify-center self-center px-1 mt-24 max-w-full bg-white rounded-xl shadow-lg blur-[1px] w-[1200px] max-md:mt-10">
          <div className="flex flex-col justify-between px-1 py-6 text-lg bg-white text-zinc-800 w-[215px]">
            <div className="flex-1 shrink gap-1 self-stretch pr-2 w-full text-2xl font-medium">
              Next of kin
            </div>
            <div className="flex flex-col mt-80 w-full max-md:mt-10">
              <div className="flex-1 shrink gap-1 self-stretch p-3 w-full whitespace-nowrap bg-gray-100 rounded-lg">
                Dashboard
              </div>
              <div className="flex-1 shrink gap-1 self-stretch mt-6 w-full">
                Create Plan
              </div>
              <div className="flex-1 shrink gap-1 self-stretch mt-6 w-full">
                Manage Beneficiary{" "}
              </div>
              <div className="flex-1 shrink gap-1 self-stretch mt-6 w-full">
                Asset Allocation
              </div>
            </div>
            <div className="flex flex-col mt-80 w-full whitespace-nowrap max-md:mt-10">
              <div className="flex-1 shrink gap-1 self-stretch w-full">
                Settings
              </div>
              <div className="flex-1 shrink gap-1 self-stretch mt-6 w-full">
                Logout
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 shrink py-7 pr-4 pl-2 my-auto bg-gray-100 rounded-xl basis-0 min-w-[240px] max-md:max-w-full">
            <div className="flex flex-wrap gap-10 justify-between items-start w-full max-md:max-w-full shadow">
              <div className="text-3xl font-bold text-zinc-800">Dashboard</div>
              <div className="gap-1 self-stretch px-7 py-4 text-lg text-white bg-blue-400 rounded-lg max-md:px-5">
                Create Plan
              </div>
            </div>
            <div className="flex flex-col px-2 py-8 mt-4 w-full bg-white rounded-lg text-zinc-800 max-md:max-w-full">
              <div className="text-2xl font-medium max-md:max-w-full">
                Wallet Over view
              </div>
              <div className="text-3xl font-bold max-md:max-w-full">
                $1234,567.89
              </div>
            </div>
            <div className="flex flex-wrap gap-7 justify-between items-center mt-4 w-full max-md:max-w-full">
              <div className="flex flex-col self-stretch px-6 py-3 my-auto bg-white rounded-lg min-w-[240px] w-[460px] max-md:px-5 max-md:max-w-full">
                <div className="gap-10 self-stretch px-2 py-4 w-full text-lg font-bold text-zinc-800">
                  Active Inheritance Plan
                </div>
                <div className="flex gap-10 justify-between items-center px-2 py-4 mt-6 w-full bg-gray-100 rounded-lg">
                  <div className="self-stretch my-auto text-base text-zinc-800">
                    Family Trust
                  </div>
                  <div className="self-stretch my-auto text-xs text-emerald-500">
                    Active
                  </div>
                </div>
                <div className="flex gap-10 justify-between items-center px-2 py-4 mt-6 w-full bg-gray-100 rounded-lg">
                  <div className="self-stretch my-auto text-base text-zinc-800">
                    Business Succession
                  </div>
                  <div className="self-stretch my-auto text-xs text-emerald-500">
                    Active
                  </div>
                </div>
                <div className="flex gap-10 justify-between items-center px-2 py-4 mt-6 w-full bg-gray-100 rounded-lg">
                  <div className="self-stretch my-auto text-base text-zinc-800">
                    Charity Donation
                  </div>
                  <div className="self-stretch my-auto text-xs text-amber-300">
                    pending
                  </div>
                </div>
              </div>
              <div className="flex flex-col self-stretch px-6 py-3 my-auto bg-white rounded-lg min-w-[240px] text-zinc-800 w-[460px] max-md:px-5 max-md:max-w-full">
                <div className="flex-1 shrink self-stretch px-2 py-4 w-full text-lg font-bold border-b border-solid border-b-neutral-400 border-b-opacity-50">
                  Recent Activities
                </div>
                <div className="flex gap-10 justify-between items-center px-2 py-4 mt-6 w-full border-b border-solid border-b-neutral-400 border-b-opacity-50">
                  <div className="self-stretch my-auto text-base">
                    Plan “Family Trust” created
                  </div>
                  <div className="self-stretch my-auto text-xs">2 days ago</div>
                </div>
                <div className="flex gap-10 justify-between items-center px-2 py-4 mt-6 w-full border-b border-solid border-b-neutral-400 border-b-opacity-50">
                  <div className="self-stretch my-auto text-base">
                    Added New Beneficiary: Joe Hault
                  </div>
                  <div className="self-stretch my-auto text-xs">5 days ago</div>
                </div>
                <div className="flex gap-10 justify-between items-center px-2 py-4 mt-6 w-full border-b border-solid border-b-neutral-400 border-b-opacity-50">
                  <div className="self-stretch my-auto text-base">
                    Updated Asset Alocation
                  </div>
                  <div className="self-stretch my-auto text-xs">
                    2 weeks ago
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col px-2 py-7 mt-4 w-full bg-white rounded-lg text-zinc-800 max-md:max-w-full">
              <div className="gap-1 self-stretch p-1 w-full text-lg font-bold max-md:max-w-full">
                Asset Distribution
              </div>
              <div className="flex flex-wrap gap-10 items-center py-3 pl-12 mt-24 w-full text-base max-md:pl-5 max-md:mt-10 max-md:max-w-full">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/66b4c34d57ed8b6849cad199dfa8c8d68c692aaee8759151b05082f061178046?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                  className="object-contain shrink-0 self-stretch my-auto aspect-[0.96] w-[216px]"
                />
                <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-0 min-w-[240px]">
                  <div className="flex gap-2 items-center w-full">
                    <div className="flex shrink-0 self-stretch my-auto bg-indigo-500 h-[33px] w-[33px]" />
                    <div className="self-stretch my-auto">
                      Family Trust (45%)
                    </div>
                  </div>
                  <div className="flex gap-2 items-center mt-6 w-full">
                    <div className="flex shrink-0 self-stretch my-auto bg-teal-400 h-[33px] w-[33px]" />
                    <div className="self-stretch my-auto">
                      Business Succession (35%)
                    </div>
                  </div>
                  <div className="flex gap-2 items-center self-start mt-6">
                    <div className="flex shrink-0 self-stretch my-auto bg-emerald-500 h-[33px] w-[33px]" />
                    <div className="self-stretch my-auto">
                      Charity Donation (25%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center px-6 py-10 mt-24 max-w-full bg-white rounded-2xl w-[1200px] max-md:px-5 max-md:mt-10">
        <div className="flex flex-col max-w-full text-center w-[616px]">
          <div className="text-5xl font-bold leading-none text-zinc-900 max-md:max-w-full">
            How its works
          </div>
          <div className="mt-7 text-lg leading-loose text-zinc-600 max-md:max-w-full">
            Lorem ipsum dolor sit amet, consectetur adipis elit
          </div>
        </div>
        <div className="flex flex-wrap gap-10 items-end mt-16 max-md:mt-10 max-md:max-w-full">
          <div className="flex flex-col min-w-[240px] w-[330px]">
            <div className="flex flex-wrap gap-5 items-end self-center w-11">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca65e326f42dfdce0d5d8837aff9d3525e706c348ba7657f404d28bb8080ec66?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain shrink-0 w-11 aspect-[1.57]"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/9c8e46f25354186074ad1813678174a4f520bdc086c77e31c946f58efbf0e4af?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain shrink-0 w-3 aspect-[0.75] fill-zinc-300 stroke-[2px] stroke-neutral-900"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/32b66c4968fd65fc433f2eb2f13950dd71445025f297b9279b1c751323c6fe1f?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain shrink-0 w-3 aspect-[0.75] fill-zinc-300 stroke-[2px] stroke-neutral-900"
              />
            </div>
            <div className="flex flex-col mt-11 w-full text-center max-md:mt-10">
              <div className="text-xl font-bold leading-none text-zinc-900">
                Create Plan
              </div>
              <div className="mt-6 text-base leading-7 text-zinc-600">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim
                nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.
              </div>
            </div>
          </div>
          <div className="flex flex-col min-w-[240px] w-[330px]">
            <div className="flex flex-wrap gap-2.5 items-end self-center w-11">
              <img
                loading="lazy"
                srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/fcfb51f60ba00fa393ade8575f54f28d8916b6f64aa9edef7e4887d3f2254dd8?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/fcfb51f60ba00fa393ade8575f54f28d8916b6f64aa9edef7e4887d3f2254dd8?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fcfb51f60ba00fa393ade8575f54f28d8916b6f64aa9edef7e4887d3f2254dd8?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/fcfb51f60ba00fa393ade8575f54f28d8916b6f64aa9edef7e4887d3f2254dd8?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/fcfb51f60ba00fa393ade8575f54f28d8916b6f64aa9edef7e4887d3f2254dd8?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/fcfb51f60ba00fa393ade8575f54f28d8916b6f64aa9edef7e4887d3f2254dd8?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/fcfb51f60ba00fa393ade8575f54f28d8916b6f64aa9edef7e4887d3f2254dd8?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/fcfb51f60ba00fa393ade8575f54f28d8916b6f64aa9edef7e4887d3f2254dd8?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain shrink-0 w-9 aspect-[2.25]"
              />
              <div className="flex shrink-0 w-2 h-2 border-2 border-solid bg-zinc-300 border-neutral-900 fill-zinc-300" />
              <div className="flex grow shrink w-1.5 border-2 border-solid border-neutral-900 h-[18px]" />
              <div className="flex grow shrink w-1.5 h-7 border-2 border-solid bg-zinc-300 border-neutral-900 fill-zinc-300" />
            </div>
            <div className="flex flex-col mt-12 w-full text-center max-md:mt-10">
              <div className="text-xl font-bold leading-none text-zinc-900">
                Asset Selection
              </div>
              <div className="mt-6 text-base leading-7 text-zinc-600">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim
                nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.
              </div>
            </div>
          </div>
          <div className="flex flex-col min-w-[240px] w-[330px]">
            <div className="flex flex-wrap gap-1.5 items-start self-center px-1.5 pt-1.5 pb-5 w-10 border-2 border-solid border-neutral-900 min-h-[67px]">
              <div className="flex grow shrink border-2 border-solid border-neutral-900 h-[13px] w-[9px]" />
              <div className="flex grow shrink h-7 border-2 border-solid bg-zinc-300 border-neutral-900 fill-zinc-300 w-[9px]" />
              <div className="flex grow shrink border-2 border-solid border-neutral-900 h-[9px] w-[9px]" />
            </div>
            <div className="flex flex-col mt-5 w-full text-center">
              <div className="text-xl font-bold leading-none text-zinc-900">
                Add Beneficiary
              </div>
              <div className="mt-6 text-base leading-7 text-zinc-600">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim
                nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch mt-16 w-full border border-solid bg-zinc-200 border-zinc-200 min-h-[1px] max-md:mt-10 max-md:max-w-full" />
        <div className="flex flex-wrap gap-10 items-end mt-16 max-md:mt-10 max-md:max-w-full">
          <div className="flex flex-col text-center min-w-[240px] w-[330px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/dae9ba97a62f6e412670a523953593acf787874bc09c9baca35b32ba19a38f0c?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
              className="object-contain self-center w-10 aspect-[0.7]"
            />
            <div className="flex flex-col mt-8 w-full">
              <div className="text-xl font-bold leading-none text-zinc-900">
                Asset Alocation
              </div>
              <div className="mt-6 text-base leading-7 text-zinc-600">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim
                nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.
              </div>
            </div>
          </div>
          <div className="flex flex-col min-w-[240px] w-[330px]">
            <div className="flex flex-col self-center px-3.5 pt-2 pb-4 w-11 border-2 border-solid border-neutral-900 min-h-[40px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/626e1946d87d52fe3e12257b480fe5e96bebeac63ae6072e2d5bd30cc3d3f539?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain w-full aspect-[1.12] fill-zinc-300 stroke-[2px] stroke-neutral-900"
              />
            </div>
            <div className="flex flex-col mt-12 w-full text-center max-md:mt-10">
              <div className="text-xl font-bold leading-none text-zinc-900">
                Activation Method
              </div>
              <div className="mt-6 text-base leading-7 text-zinc-600">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim
                nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.
              </div>
            </div>
          </div>
          <div className="flex flex-col text-center min-w-[240px] w-[330px]">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/84629f565b52f96c330c0710edb00d1bbe1328fce52cb00eac6518c58eb31c7f?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
              className="object-contain self-center aspect-[0.78] w-[42px]"
            />
            <div className="flex flex-col mt-9 w-full">
              <div className="text-xl font-bold leading-none text-zinc-900">
                Review & Confirm{" "}
              </div>
              <div className="mt-6 text-base leading-7 text-zinc-600">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim
                nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start px-4 py-12 mt-24 max-w-full w-[1200px] max-md:mt-10">
        <div className="gap-1 self-stretch p-1 text-4xl font-bold text-center whitespace-nowrap text-zinc-800">
          FEATURES
        </div>
        <div className="flex flex-wrap gap-10 items-start mt-9 max-md:max-w-full">
          <div className="flex flex-col justify-center px-16 py-9 bg-white rounded-3xl shadow-lg min-w-[240px] w-[330px] max-md:px-5">
            <div className="flex flex-col justify-center items-center self-center w-[60px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/578c9046c4553e7b00ef2fa595860e607ba22d78c97e667dc67ff3790e0f8a3b?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain w-full aspect-square"
              />
            </div>
            <div className="flex flex-col mt-11 w-full text-center max-md:mt-10">
              <div className="text-xl font-bold leading-7 text-zinc-900">
                Smart Contract Security
              </div>
              <div className="mt-6 text-base leading-7 text-zinc-600">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim
                nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center px-16 py-24 bg-white rounded-3xl shadow-lg min-w-[240px] w-[330px] max-md:px-5">
            <div className="flex flex-col self-center w-[60px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/1a68a6965fea7c5334a14374b681c09790c8bcfeb386e22ac3c9e5d1f8907256?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain w-full aspect-square"
              />
            </div>
            <div className="flex flex-col mt-11 w-full text-center max-md:mt-10">
              <div className="text-xl font-bold leading-none text-zinc-900">
                Flexible Allocation
              </div>
              <div className="mt-6 text-base leading-7 text-zinc-600">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim
                nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center px-16 py-9 bg-white rounded-3xl shadow-lg min-w-[240px] w-[330px] max-md:px-5">
            <div className="flex flex-col self-center w-[60px]">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/c31532d1ba319de081bbc78bffc9d12f2c23bb09c872ba5fc869410f8e8a16fb?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain w-full aspect-square"
              />
            </div>
            <div className="flex flex-col mt-11 w-full text-center max-md:mt-10">
              <div className="text-xl font-bold leading-none text-zinc-900">
                Privacy First
              </div>
              <div className="mt-6 text-base leading-7 text-zinc-600">
                Lorem ipsum dolor sit amet, consectetur adipis elit. Sit enim
                nec, proin faucibus nibh et sagittis a. Lacinia purus ac amet.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-24 max-w-full bg-white rounded-3xl w-[1200px] max-md:mt-10">
        <div className="flex flex-col justify-center px-16 py-20 w-full max-w-[1200px] max-md:px-5 max-md:max-w-full">
          <div className="text-4xl font-bold text-center text-zinc-800 max-md:max-w-full">
            Ready to Secure Your Crypto Legacy?
          </div>
          <div className="gap-1 self-center px-24 py-6 mt-16 text-lg text-white bg-blue-400 rounded-2xl max-md:px-5 max-md:mt-10">
            Get Started
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-2 mt-24 max-w-full w-[1200px] max-md:px-5 max-md:mt-10">
        <div className="gap-1 self-start p-1 text-4xl font-bold whitespace-nowrap text-zinc-800">
          FAQ
        </div>
        <div className="flex flex-col justify-center items-center mt-6 w-full text-2xl font-medium text-neutral-500 text-opacity-90 max-md:max-w-full">
          <div className="flex overflow-hidden flex-col justify-center p-6 w-full bg-white rounded-xl max-w-[1200px] shadow-[0px_5px_16px_rgba(8,15,53,0.25)] max-md:px-5 max-md:max-w-full">
            <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
              <div className="self-stretch my-auto">
                Why should i use this protocol
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0575fbbb3abbeeb3aa1e06f085e8cb360cf260c95b092a59ffe915a0750b97b8?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square shadow-[0px_4px_16px_rgba(8,15,53,0.1)]"
              />
            </div>
          </div>
          <div className="flex overflow-hidden flex-col justify-center p-6 mt-6 w-full bg-white rounded-xl max-w-[1200px] shadow-[0px_5px_16px_rgba(8,15,53,0.25)] max-md:px-5 max-md:max-w-full">
            <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
              <div className="self-stretch my-auto">
                How secure is this protocol
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/717503f2bb73b160b1ddfb94efb21b0517425137e26f69f404e1f4195ca7fce2?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square shadow-[0px_4px_16px_rgba(8,15,53,0.1)]"
              />
            </div>
          </div>
          <div className="flex overflow-hidden flex-col justify-center p-6 mt-6 w-full bg-white rounded-xl max-w-[1200px] shadow-[0px_5px_16px_rgba(8,15,53,0.25)] max-md:px-5 max-md:max-w-full">
            <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
              <div className="self-stretch my-auto max-md:max-w-full">
                Can I get a one one conversation through the plartform
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/9b3dc46e431a031db39983315cdd4199496463ecb67e9aa9d48bce7ce8a41402?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square shadow-[0px_4px_16px_rgba(8,15,53,0.1)]"
              />
            </div>
          </div>
          <div className="flex overflow-hidden flex-col justify-center p-6 mt-6 w-full bg-white rounded-xl max-w-[1200px] shadow-[0px_5px_16px_rgba(8,15,53,0.25)] max-md:px-5 max-md:max-w-full">
            <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
              <div className="self-stretch my-auto">
                Why should i use this protocol
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/3748ff36adbc197d1ed5fdda80a10d5ab4eb7b852a37e8bb0787fdcb3004ce5d?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square shadow-[0px_4px_16px_rgba(8,15,53,0.1)]"
              />
            </div>
          </div>
          <div className="flex overflow-hidden flex-col justify-center p-6 mt-6 w-full bg-white rounded-xl max-w-[1200px] shadow-[0px_5px_16px_rgba(8,15,53,0.25)] max-md:px-5 max-md:max-w-full">
            <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
              <div className="self-stretch my-auto">
                Why should i use this protocol
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8ae6020a076e2594efbecb800b3f17c0371ed761f20cd0e74b82523af48cd131?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square shadow-[0px_4px_16px_rgba(8,15,53,0.1)]"
              />
            </div>
          </div>
          <div className="flex overflow-hidden flex-col justify-center p-6 mt-6 w-full bg-white rounded-xl max-w-[1200px] shadow-[0px_5px_16px_rgba(8,15,53,0.25)] max-md:px-5 max-md:max-w-full">
            <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
              <div className="self-stretch my-auto">
                Why should i use this protocol
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8ebdabbe53e12576e412cfad7dfbe773f5e1f75fe915b8f791c341f41a20abd5?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
                className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square shadow-[0px_4px_16px_rgba(8,15,53,0.1)]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center p-1 mt-24 max-w-full w-[1304px] max-md:mt-10">
        <div className="flex relative flex-col justify-center px-52 py-24 w-full min-h-[349px] max-md:px-5 max-md:max-w-full">
          <div className="flex absolute top-0 right-0 z-0 bg-blue-400 rounded-3xl h-[318px] min-h-[318px] w-[1296px]" />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d8723c2684d402352386a907f8ec85b8c8078f51c79c8a294fc9ed583027bffe?placeholderIfAbsent=true&apiKey=eba875dab1214929bd98ae0dcf32a556"
            className="object-contain absolute top-0 right-0 z-0 rounded-none aspect-[4.08] h-[318px] w-[1296px]"
          />
          <div className="z-0 self-center text-5xl font-bold text-center text-stone-50 max-md:max-w-full max-md:text-4xl">
            Subscribe to our newsletter
          </div>
          <div className="flex z-0 flex-wrap gap-10 justify-center items-start self-center mt-10 text-base leading-loose text-white max-md:max-w-full">
            <div className="flex flex-col justify-center bg-blue-400 rounded-lg border border-blue-500 border-solid min-h-[60px] min-w-[240px] w-[270px]">
              <div className="flex-1 gap-3.5 self-stretch py-4 pr-4 pl-5 bg-blue-400 rounded-md border border-solid border-zinc-300 size-full">
                First name
              </div>
            </div>
            <div className="flex flex-col justify-center bg-blue-400 rounded-lg border border-blue-500 border-solid min-h-[60px] min-w-[240px] w-[270px]">
              <div className="flex-1 gap-3.5 self-stretch py-4 pr-4 pl-5 bg-blue-400 rounded-md border border-solid border-zinc-300 size-full">
                Email address
              </div>
            </div>
            <div className="flex flex-col justify-center items-center p-4 w-64 font-semibold tracking-normal leading-7 text-right text-blue-400 bg-gray-100 rounded-lg min-h-[60px] min-w-[240px]">
              <div className="gap-2.5 self-stretch">Subscribe Now</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
