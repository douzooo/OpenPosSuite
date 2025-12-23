import { useScreen } from "../state/useScreen";

const StartScreen = () => {
  const {  goTo} = useScreen();
  return (
    <div className="absolute w-full h-full flex flex-col bg-yellow-100">
      <h2>How would you like to eat today</h2>
      <div className="flex gap-2">
        <button
          className="rounded-2xl bg-white w-[220px] h-[300px] font-bold cursor-pointer"
          onClick={async () => {
            goTo("MENU");
          }}
        >
          Take Out
        </button>
        <button className="rounded-2xl bg-white w-[220px] h-[300px] font-bold">
          Eat In
        </button>
      </div>
    </div>
  );
};
export default StartScreen;
