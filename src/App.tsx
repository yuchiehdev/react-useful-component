import { useState } from "react";
import Select from "./Select";
import "./index.css";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
  { label: "Option 4", value: "4" },
  { label: "Option 5", value: "5" },
];

function App() {
  const [valueSingle, setValueSingle] = useState<typeof options[0] | undefined>(
    options[0]
  );
  const [valueMutiple, setValueMutiple] = useState<
    typeof options[0][] | undefined
  >([options[0]]);
  return (
    <>
      <Select
        options={options}
        value={valueSingle}
        onChange={(o) => setValueSingle(o)}
      />
      <Select
        multiple
        options={options}
        value={valueMutiple}
        onChange={(o) => setValueMutiple(o)}
      />
    </>
  );
}

export default App;
