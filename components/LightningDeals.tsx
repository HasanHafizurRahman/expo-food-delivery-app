import { LightningIcon, RightArrowIconMobile } from "@/assets/icons/HomeIcons";

export default function LightningDeals() {
  return (
    <>
      <section className="block md:hidden mx-auto w-full px-4 pt-[6px]">
        <div className="bg-main-primary-0 rounded-lg flex items-center justify-between h-[50px] px-2">
          <div className="flex items-center space-x-2">
            <LightningIcon />
            <span className="text-white font-bold text-sm">Lightning Deals</span>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-white text-xs font-medium">Limited time offer</span>
            <RightArrowIconMobile />
          </div>
        </div>
      </section>
    </>
  );
}
