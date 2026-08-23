import { Button } from "./shared/ui/button";

function App() {
  return (
    <div>
      <p className="">Hello</p>
      <Button variant="default" onClick={() => console.log("work")}>
        BUTTON TEST
      </Button>
    </div>
  );
}

export default App;
