//Spicfy the type of button in case of multiple buttons in single form
const ViewAllButton = ({ visible, children, onClick }) => {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="dark:text-white text-primary hover:underline transition"
    >
      {children}
    </button>
  );
};

export default ViewAllButton;
