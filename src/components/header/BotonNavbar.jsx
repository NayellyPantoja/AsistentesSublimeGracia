import "../../styles/App.css";

const BotonNavbar = ({sidebar, setSidebar}) => {

  const handleIconClick = () => {
    setSidebar(!sidebar);
  };
  return (
    <>
      <div
        className={`icon nav-icon-5 ${sidebar ? "open" : ""}`}
        onClick={handleIconClick}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      
    </>
  );
};

export default BotonNavbar;