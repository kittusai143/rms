import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const handleSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    closeOnClick: true,
  });
}

export const handleErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    closeOnClick: true,
  });
}

const Toast = () => {
	return (
		<div>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				closeOnClick
			/>
		</div>
	);
}

export default Toast