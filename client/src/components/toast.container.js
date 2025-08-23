import { ToastContainer } from 'react-toastify';

const toastContainer = () => {
    return (
        <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    );
}

export default toastContainer;