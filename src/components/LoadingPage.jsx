import { useState } from "react";
import HashLoader from "react-spinners/HashLoader";

const override = {
    display: "flex",
    justifyContent:"center",
    alignItems:"center",
    margin: "0 auto",
    borderColor: "red",
    height:"100vh",
};

function LoadingPage() {
    const [loading] = useState(true);
    const [color, setColor] = useState("#000");

    return (
        <div className="sweet-loading">
            <HashLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}

export default LoadingPage;
