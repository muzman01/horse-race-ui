import { mainLogo } from "../../images";

const HomeContainer = () => {
  return (
    <div className="px-4 mt-4 flex justify-center">
      <div className="w-80 h-80 p-4 rounded-full circle-outer">
        <div className="w-full h-full rounded-full circle-inner">
          <img
            src={mainLogo}
            alt="Main Character"
            className="w-full h-full rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeContainer;
