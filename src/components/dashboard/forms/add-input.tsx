import { Input } from "@/components/ui/input";
import { MinusCircle, PaintBucket, PlusCircle } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { SketchPicker } from "react-color";

// type InputDetail = Record<string, string | number>;

// types.ts
export type InputDetail = {
  [key: string]: string | number | undefined;
};

// const rahim: InputDetail = {
//   name: "Rahim",
//   age: 20,
//   hobby:null
// };
/**
 * A generic T is always unequal to other defined or infered type as it might be instantiated with a different type.
    Exp: { color: string} != T; until generic T is set to <Component<{color:string}>
 * A setter for a specific type cannot safely be used where a setter for a broader type is expected.
 * For reusable form components like this, generics (T extends InputDetail) are the idiomatic and type-safe solution. */
type PropsType<T extends InputDetail> = {
  inputDetails: T[];
  setInputDetails: Dispatch<SetStateAction<T[]>>; // any is placed as ts warns for setter function is having a property that is missing in InputDetail
  header: string; // as label for input,
  initialInputDetail?: T;
  colorPicker?: boolean; // is color picker needed
};

// T extending InputDetail to resolve constraint of PropsType param T and making sure T will extend InputDetail from where concrete data will be passed
export default function AddInput<T extends InputDetail>({
  inputDetails,
  initialInputDetail = {} as T,
  setInputDetails,
  header,
  colorPicker
}: PropsType<T>) {
  // State to toggle displaying color picker based on index. if null hide picker
  const [colorPickerIndex, setColorPickerIndex] = useState<number | null>(null);

  function handleChangeInputDetail(
    index: number,
    key: string,
    inputValue: string | number
  ) {
    // Update the inputDetails array with the new property value
    const updatedInputDetails = inputDetails.map((detail, i) => {
      return i === index ? { ...detail, [key]: inputValue } : detail;
    });
    setInputDetails(updatedInputDetails); // Update the state with the modified details  }
  }

  function handleRemoveInput(index: number) {
    // prevent removing if there's only one inputDetail
    if (inputDetails.length === 1) return;
    const updatedInputDetails = inputDetails.filter((_, i) => i !== index); //0,1,2,3--2-->0,1,3
    setInputDetails(updatedInputDetails);
  }

  function handleAddInput() {
    const updatedInputs = [...inputDetails, { ...initialInputDetail }];
    setInputDetails(updatedInputs); // add the initial object to set initial values
    console.log(updatedInputs);
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* HEADER */}
      {header && <h4>{header}</h4>}
      {/* Display PlusButton if no details exist */}
      {inputDetails.length === 0 && <PlusButton onClick={handleAddInput} />}
      {/* Map through details and render input fields */}
      {inputDetails.map((detail, index) => {
        return (
          <div key={index} className="flex items-center gap-x-4">
            {Object.entries(detail).map(([key, value], entryIndex) => {
              return (
                <div key={entryIndex} className="flex items-center gap-x-4">
                  {/*COLOR-PICKER TOGGLE*/}
                  {key === "color" && colorPicker && (
                    <div className="flex gap-x-4">
                      <button
                        type="button"
                        className="cursor-pointer"
                        onClick={() =>
                          setColorPickerIndex(colorPickerIndex === index ? null : index)
                        }
                      >
                        <PaintBucket />
                      </button>
                      <span
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: detail[key] as string }}
                      />
                    </div>
                  )}

                  {/* COLOR PICKER */}
                  {colorPickerIndex === index && key === "color" && (
                    <SketchPicker
                      color={detail[key] as string}
                      onChange={(e) => handleChangeInputDetail(index, key, e.hex)}
                    />
                  )}

                  <Input
                    className="w-28"
                    type={typeof value === "number" ? "number" : "text"}
                    name={key}
                    placeholder={key}
                    value={value}
                    min={typeof value === "number" ? 0 : undefined}
                    step="0.01" // allows float number difference to 0.01
                    onChange={(e) =>
                      handleChangeInputDetail(
                        index,
                        key,
                        e.target.type === "number"
                          ? parseFloat(e.target.value)
                          : e.target.value
                      )
                    }
                  />
                </div>
              );
            })}
            {/* Show buttons for each row of inputs */}
            <MinusButton onClick={() => handleRemoveInput(index)} />
            <PlusButton onClick={handleAddInput} />
          </div>
        );
      })}
    </div>
  );
}

// PlusButton component for adding new details
const PlusButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      title="Add new detail"
      className="group cursor-pointer outline-none hover:rotate-90 duration-300"
      onClick={onClick}
    >
      {/* Plus icon */}
      <PlusCircle className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-primary-light group-active:stroke-blue-200 group-active:fill-blue-700 group-active:duration-0 duration-300" />
    </button>
  );
};

// MinusButton component for removing details
const MinusButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      title="Remove detail"
      className="group cursor-pointer outline-none hover:rotate-90 duration-300"
      onClick={onClick}
    >
      {/* Minus icon */}
      <MinusCircle className="w-8 h-8 stroke-blue-400 fill-none group-hover:fill-primary-light  group-active:stroke-blue-200 group-active:fill-blue-700 group-active:duration-0 duration-300" />
    </button>
  );
};
