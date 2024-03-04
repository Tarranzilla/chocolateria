import { NextApiResponse } from "next";
import Link from "next/link";

function Error({ statusCode }: { statusCode?: number }) {
    return (
        <div className="Page_Wrapper">
            <div className="Error">
                <span className="material-icons Error_Icon">error</span>
                <h1 className="Error_Title">{statusCode ? `An error ${statusCode} occurred on server` : "An error occurred on client"}</h1>
                <Link className="Error_Btn" href="/">
                    Go back home
                </Link>
            </div>
        </div>
    );
}

Error.getInitialProps = ({ res, err }: { res?: NextApiResponse; err?: any }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
