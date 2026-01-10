const ErrorScreen: React.FC<{message?: string}> = ({message}) => {
    return (
       <div className="m-4 p-4 border-4 border-red-400 bg-red-600">
        <h1 className="text-white text-4xl font-extrabold">Error</h1>
        <p className="text-white my-4 rounded-md">{message}</p>
        <p className="text-white uppercase font-extrabold">Please contact a staff member</p>
      </div>
    );
}

export default ErrorScreen;