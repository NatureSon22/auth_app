import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { decrement, increment, incrementAsync, incrementByAmount } from "../states/counter/counterSlice";

const Counter = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Counter: {count}</h2>
      <div>
        <button onClick={() => dispatch(incrementAsync(10))}>increment</button>
        <button onClick={() => dispatch(decrement())}>decrement</button>
      </div>
    </div>
  );
};

export default Counter;
