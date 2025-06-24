import PropTypes from 'prop-types';
import { RxCross1 } from "react-icons/rx";

const CustomModal = ({ isOpen, onClose, isSubscription, message, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-content relative top-0 overflow-auto">
                <div className='flex justify-between items-center bg-white mx-auto sticky py-2 top-0 z-[9999]'>
                    <h2 className="font-THICCCBOI-Bold font-bold text-[30px] leading-[50px] capitalize">
                        {message || (isSubscription ? "Purchase Subscription" : "Purchase Revision")}
                    </h2>
                    <button className="" onClick={onClose}>
                        <RxCross1 className='text-2xl font-bold' />
                    </button>
                </div>
                <div className='overflow-auto'>
                    {children}
                </div>
            </div>
        </div>
    );
};

CustomModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isSubscription: PropTypes.bool,
    message: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default CustomModal;