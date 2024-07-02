import PropTypes from "prop-types";

const Popup = ({ children, style }) => {
  return (
    <div
      className={`absolute top-8 z-10 w-max translate-y-[0%] rounded-md p-2 opacity-0 shadow-lg ${style} transition-all duration-300`}
    >
      {children}
    </div>
  );
};

Popup.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.string.isRequired,
};

export default Popup;
