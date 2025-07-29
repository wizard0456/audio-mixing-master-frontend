import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINT, DOMAIN, ORDER_STATUS } from '../utils/constants';
import { useSelector } from 'react-redux';
import { selectUser, getUserToken } from '../reducers/authSlice';
import PurpleShadowBG from "../assets/images/purple-shadow-bg.webp";
import GreenShadowBG from "../assets/images/green-shadow-bg.webp";
import Loader from '../components/Loader';
import MessageModal from '../components/MessageModal'; // Import the MessageModal
import CustomModal from '../components/CustomModal';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [revisions, setRevisions] = useState([]);
    const [orderStatus, setOrderStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector(selectUser);
    const currentAudioRef = useRef(null); // Ref to store the current playing audio
    const [activeAccordions, setActiveAccordions] = useState(['orderItems']);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [selectedOrderItem, setSelectedOrderItem] = useState(null);
    const [isGiftCard, setIsGiftCard] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios(`${API_ENDPOINT}orders/${orderId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${getUserToken(user)}`
                    },
                });

                // Handle the new response structure
                const orderData = response.data.data;
                
                setOrderItems(orderData.order.orderItems || []);
                setOrder(orderData.order);
                setRevisions(orderData.order.revisions || []); // Fix: revisions are inside order object
                setLoading(false);
                setOrderStatus(orderData.order.Order_status);
                setIsGiftCard(orderData.is_giftcard || false);
            } catch (error) {
                console.error('Fetch order error:', error);
                setError('Failed to load order details');
                setLoading(false);
            }
        };

        if (user) {
            fetchOrder();
        }
    }, [orderId, user]);

    // Function to handle play event and ensure only one audio plays at a time
    const handlePlay = (audioElement) => {
        // If there is a currently playing audio, pause it
        if (currentAudioRef.current && currentAudioRef.current !== audioElement) {
            currentAudioRef.current.pause();
        }
        // Update the ref to the new audio element
        currentAudioRef.current = audioElement;
    };

    const calculateTotalPrice = () => {
        return orderItems.reduce((total, item) => total + parseFloat(item.total_price), 0);
    };

    const calculateDiscountedTotal = () => {
        return parseFloat(order.amount);
    };

    const calculateDiscountAmount = () => {
        return calculateTotalPrice() - calculateDiscountedTotal();
    };

    const toggleAccordion = (section) => {
        setActiveAccordions(prevState =>
            prevState.includes(section)
                ? prevState.filter(item => item !== section)
                : [...prevState, section]
        );
    };

    const isAccordionOpen = (section) => {
        return activeAccordions.includes(section);
    };

    const getRevisionsForItem = (itemId) => {
        return revisions.filter(revision => revision.service_id === Number(itemId)).sort((a, b) => a.id - b.id);
    };

    const renderRevisionFiles = (files) => {
        if (!files) return null;
        
        let parsedFiles = [];
        try {
            parsedFiles = JSON.parse(files);
        } catch (e) {
            console.error("Invalid JSON in revision files:", files);
            return <p className="text-red-400">Error loading files</p>;
        }

        return parsedFiles.map((file, idx) => {
            const isExternalLink = file.startsWith('http://') || file.startsWith('https://');
            const fileName = `Revision File ${idx + 1}`;
            
            // Detect cloud service type
            const getCloudService = (url) => {
                if (url.includes('drive.google.com') || url.includes('docs.google.com')) return 'Google Drive';
                if (url.includes('dropbox.com')) return 'Dropbox';
                if (url.includes('onedrive.live.com') || url.includes('1drv.ms')) return 'OneDrive';
                if (url.includes('icloud.com')) return 'iCloud';
                if (url.includes('mega.nz')) return 'MEGA';
                if (url.includes('box.com')) return 'Box';
                return 'External Link';
            };

            const cloudService = isExternalLink ? getCloudService(file) : 'External Link';
            
            return (
                <div key={idx} className="bg-gray-800 rounded-[15px] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#4CC800] rounded-full p-2">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-THICCCBOI-Medium text-white text-sm">{fileName}</p>
                            <p className="font-THICCCBOI-Regular text-gray-400 text-xs">
                                <span className="flex items-center gap-1">
                                    <span className="inline-block w-2 h-2 bg-[#4CC800] rounded-full"></span>
                                    {cloudService}
                                </span>
                            </p>
                        </div>
                    </div>
                    <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#4CC800] hover:bg-[#3DA600] text-white font-THICCCBOI-Medium text-sm px-4 py-2 rounded-[8px] transition-colors duration-200 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10.5l-4.5-4.5v3h-9v3h9v3l4.5-4.5z" clipRule="evenodd" />
                        </svg>
                        Open
                    </a>
                </div>
            );
        });
    };

    const openMessageModal = (item) => {
        setSelectedOrderItem(item);
        setIsMessageModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeMessageModal = () => {
        setSelectedOrderItem(null);
        setIsMessageModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    const handleOnClickRead = async (itemId) => {
        toggleAccordion('files');
        if (order.user_is_read == "1") return;
        try {
            const response = await axios(`${API_ENDPOINT}revisions/user-flag/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${getUserToken(user)}`,
                },
                data: {
                    user_is_read: '1',
                    type: 'order',
                    order_item_id: itemId,
                }
            });

            setOrderItems(response.data);
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleIsReadedForRevision = async (itemId) => {
        try {
            const response = await axios({
                method: "post",
                url: `${API_ENDPOINT}user-flag/${orderId}`,
                headers: {
                    'Authorization': `Bearer ${getUserToken(user)}`,
                },
                data: {
                    user_is_read: "1",
                    type: "revision",
                    order_item_id: itemId,
                }
            });

            setRevisions(response.data);
        } catch (error) {
            console.error('Error marking revision as read:', error);
        }
    };

    return (
        <main>
            <section className="text-white mt-24 relative z-20">
                <picture>
                    <source srcSet={GreenShadowBG} type="image/webp" />
                    <img src={GreenShadowBG} className="absolute -top-[300%] left-0 pointer-events-none" width={1000} alt="Green shadow" />
                </picture>
                <picture>
                    <source srcSet={PurpleShadowBG} type="image/webp" />
                    <img src={PurpleShadowBG} className="absolute -top-[200%] right-0 pointer-events-none" width={1000} alt="Purple shadow" />
                </picture>
                <div className="relative z-20 p-8 bg-[#0B1306] px-5 md:px-10 xl:px-0">
                    <div className="max-w-[1110px] mx-auto">
                        <h1 className="font-THICCCBOI-Medium text-[40px] leading-[50px] font-medium mb-7">
                            Order Details
                        </h1>
                        <p className="font-Roboto font-normal text-base leading-6">
                            <Link to="/orders">Order List</Link> /{" "}
                            <span className="text-[#4CC800] font-semibold">Order #{orderId}</span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="text-white mt-24 mb-36 relative z-20">
                <div className="max-w-[1110px] mx-auto">
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <div className="text-center text-red-400">
                            <p>{error}</p>
                        </div>
                    ) : (
                        order && order.id ? (
                            <div className="flex flex-col lg:flex-row items-start gap-8">
                                <div className="w-full flex flex-col gap-5">
                                    <div
                                        className="p-8 bg-black rounded-[20px] text-white flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleAccordion('orderInfo')}
                                    >
                                        <h2 className="font-THICCCBOI-Bold text-[20px] leading-[24px]">Order Summary</h2>
                                        <span className="font-THICCCBOI-Medium text-[20px] leading-[24px]">{isAccordionOpen('orderInfo') ? '-' : '+'}</span>
                                    </div>
                                    {isAccordionOpen('orderInfo') && (
                                        <div className="p-8 flex flex-col gap-3 bg-black rounded-[20px] text-white">
                                            <p className="font-THICCCBOI-Medium text-lg"><strong>Payer Name:</strong> {order.payer_name}</p>
                                            <p className="font-THICCCBOI-Medium text-lg"><strong>Payer Email:</strong> {order.payer_email}</p>
                                            <p className="font-THICCCBOI-Medium text-lg"><strong>Transaction ID:</strong> {order.transaction_id}</p>
                                            <p className="font-THICCCBOI-Medium text-lg"><strong>Amount:</strong> {order.amount} {order.currency}</p>
                                            <p className="font-THICCCBOI-Medium text-lg"><strong>Status:</strong> {order.payment_status}</p>
                                            {isGiftCard == 1 && (
                                                <p className="font-THICCCBOI-Medium text-lg"><strong>Order Status:</strong><span className={`bg-[${ORDER_STATUS[orderStatus]?.color || '#666'}] w-fit rounded-md px-2 py-1 mx-1`}>{ORDER_STATUS[orderStatus]?.name || 'Unknown'}</span></p>
                                            )}
                                            <p className="font-THICCCBOI-Medium text-lg"><strong>Order Type:</strong> {order.order_type}</p>
                                            <p className="font-THICCCBOI-Medium text-lg"><strong>Payment Method:</strong> {order.payment_method}</p>
                                            <p className="font-THICCCBOI-Medium text-lg"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            <p className="font-THICCCBOI-Medium text-lg"><strong>Total Price:</strong> ${calculateTotalPrice().toFixed(2)}</p>
                                            <p className="font-THICCCBOI-Medium text-lg"><strong>Discount Applied:</strong> ${calculateDiscountAmount() == 0 ? 0 : '-' + calculateDiscountAmount()?.toFixed(2)}</p>
                                            <p className="font-THICCCBOI-Medium text-lg"><strong>Discounted Total:</strong> ${calculateDiscountedTotal().toFixed(2)}</p>
                                        </div>
                                    )}

                                    {/* Order Items Accordion */}
                                    <div
                                        className={`p-8 rounded-[20px] flex items-center justify-between bg-black text-white cursor-pointer`}
                                        onClick={() => toggleAccordion('orderItems')}>
                                        <h2 className="font-THICCCBOI-Bold text-[20px] leading-[24px]">Order Items ({orderItems.length})</h2>
                                        <span className="font-THICCCBOI-Medium text-[20px] leading-[24px]">{isAccordionOpen('orderItems') ? '-' : '+'}</span>
                                    </div>
                                    {isAccordionOpen('orderItems') && (
                                        isGiftCard == 1 ? (
                                            <div className="p-8 flex flex-col gap-3 bg-black rounded-[20px] text-white">
                                                {orderItems.map(item => (
                                                    <div className='flex md:flex-nowrap flex-wrap gap-3' key={item.id}>
                                                        <p className="font-THICCCBOI-Medium text-lg flex flex-col justify-center flex-grow items-center"><strong>Name</strong> {item.name}</p>
                                                        <p className="font-THICCCBOI-Medium text-lg flex flex-col justify-center flex-grow items-center"><strong>Quantity</strong> {item.quantity}</p>
                                                        <p className="font-THICCCBOI-Medium text-lg flex flex-col justify-center flex-grow items-center"><strong>Price per Unit</strong> ${parseFloat(item.price).toFixed(2)}</p>
                                                        <p className="font-THICCCBOI-Medium text-lg flex flex-col justify-center flex-grow items-center"><strong>Total Price</strong> ${parseFloat(item.total_price).toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-5">
                                                {orderItems.map((item) => (
                                                    <div key={item.id} className="p-6 flex flex-col gap-3 bg-black rounded-[20px] text-white relative"
                                                        onClick={() => {
                                                            if ((getRevisionsForItem(item.service_id).filter((item) => ((item.user_is_read == 0))).length > 0)) {
                                                                handleIsReadedForRevision(item.id);
                                                            }
                                                            if (Number(item.user_is_read) == 0) {
                                                                handleOnClickRead(item.id);
                                                            }
                                                        }}>
                                                        {getRevisionsForItem(item.service_id).filter((item) => item.user_is_read == 0).length > 0 && (
                                                            <span className="absolute -top-2 -left-3 bg-[#4CC800] text-white font-THICCCBOI-Medium text-sm px-3 py-1 rounded-full">Revision Updated</span>
                                                        )}
                                                        {Number(item.user_is_read) == 0 && (
                                                            <span className="absolute -top-2 -left-3 bg-[#4CC800] text-white font-THICCCBOI-Medium text-sm px-3 py-1 rounded-full">New File</span>
                                                        )}

                                                        <div className='flex flex-col md:flex-row justify-between items-center gap-3'>
                                                            <p className="font-THICCCBOI-Medium text-lg flex gap-3 text-wrap"><strong>Name:</strong> {item.name}</p>
                                                            {orderStatus == 2 && <button onClick={() => openMessageModal(item)} className='bg-[#4CC800] text-white font-THICCCBOI-Medium text-[16px] px-5 py-2 rounded-[10px]'>Request a Revision</button>}
                                                        </div>

                                                        <div className='flex md:flex-nowrap flex-wrap gap-3'>
                                                            <p className="font-THICCCBOI-Medium text-lg flex flex-col justify-center flex-grow items-center"><strong>Quantity</strong> {item.quantity}</p>
                                                            <p className="font-THICCCBOI-Medium text-lg flex flex-col justify-center flex-grow items-center"><strong>Price per Unit</strong> ${parseFloat(item.price).toFixed(2)}</p>
                                                            <p className="font-THICCCBOI-Medium text-lg flex flex-col justify-center flex-grow items-center"><strong>Total Price</strong> ${parseFloat(item.total_price).toFixed(2)}</p>
                                                            <p className="font-THICCCBOI-Medium text-lg capitalize flex flex-col justify-center flex-grow items-center"><strong>Service Type</strong> {item.service_type}</p>
                                                            <p className="font-THICCCBOI-Medium text-lg flex text-white px-3 py-1 rounded flex-col justify-center flex-grow items-center"><strong>Remaining Free Revisions</strong> {item.max_revision}</p>
                                                        </div>

                                                        <div className='flex flex-col md:flex-row gap-5'>
                                                            {/* Render Deliverable Files */}
                                                            {item?.deliverable_files && (() => {
                                                                let parsedFiles = [];
                                                                try {
                                                                    parsedFiles = JSON.parse(item.deliverable_files);
                                                                } catch (e) {
                                                                    console.error("Invalid JSON in deliverable files:", item.deliverable_files);
                                                                    return null;
                                                                }
                                                                
                                                                return parsedFiles.length > 0 ? (
                                                                    <div className='mt-5 lg:w-1/2 w-full'>
                                                                        <div className={`flex items-center justify-between bg-black text-white relative mb-5`}>
                                                                            <h2 className="font-THICCCBOI-Bold text-[18px] leading-[22px]">Delivery Files ({parsedFiles.length})</h2>
                                                                        </div>
                                                                        <div className="flex flex-col gap-3">
                                                                            {parsedFiles.map((file, idx) => {
                                                                                const isExternalLink = file.startsWith('http://') || file.startsWith('https://');
                                                                                const fileName = `Delivery File ${idx + 1}`;
                                                                                
                                                                                // Detect cloud service type
                                                                                const getCloudService = (url) => {
                                                                                    if (url.includes('drive.google.com') || url.includes('docs.google.com')) return 'Google Drive';
                                                                                    if (url.includes('dropbox.com')) return 'Dropbox';
                                                                                    if (url.includes('onedrive.live.com') || url.includes('1drv.ms')) return 'OneDrive';
                                                                                    if (url.includes('icloud.com')) return 'iCloud';
                                                                                    if (url.includes('mega.nz')) return 'MEGA';
                                                                                    if (url.includes('box.com')) return 'Box';
                                                                                    return 'Cloud Storage';
                                                                                };

                                                                                const cloudService = isExternalLink ? getCloudService(file) : 'External Link';
                                                                                
                                                                                return (
                                                                                    <div key={idx} className="bg-gray-800 rounded-[15px] p-4 flex items-center justify-between">
                                                                                        <div className="flex items-center gap-3">
                                                                                            <div className="bg-[#4CC800] rounded-full p-2">
                                                                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                                                                                </svg>
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="font-THICCCBOI-Medium text-white text-sm">{fileName}</p>
                                                                                                <p className="font-THICCCBOI-Regular text-gray-400 text-xs">
                                                                                                    <span className="flex items-center gap-1">
                                                                                                        <span className="inline-block w-2 h-2 bg-[#4CC800] rounded-full"></span>
                                                                                                        {cloudService}
                                                                                                    </span>
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <a
                                                                                            href={file}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="bg-[#4CC800] hover:bg-[#3DA600] text-white font-THICCCBOI-Medium text-sm px-4 py-2 rounded-[8px] transition-colors duration-200 flex items-center gap-2"
                                                                                        >
                                                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                                <path fillRule="evenodd" d="M18 10.5l-4.5-4.5v3h-9v3h9v3l4.5-4.5z" clipRule="evenodd" />
                                                                                            </svg>
                                                                                            Open
                                                                                        </a>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                ) : null;
                                                            })()}

                                                            {/* Render Revisions */}
                                                            {getRevisionsForItem(item.service_id).length > 0 && (
                                                                <div className="mt-5 lg:w-1/2 w-full">
                                                                    <h3 className="font-THICCCBOI-Bold text-[18px] leading-[22px]">Revisions</h3>
                                                                    {getRevisionsForItem(item.service_id)
                                                                        .reverse()
                                                                        .map((revision) => (
                                                                            <div key={revision.id} className="p-4 bg-gray-800 rounded-lg mt-5 flex flex-col gap-2">
                                                                                <p className="font-THICCCBOI-Medium text-lg">
                                                                                    <strong>Revision ID:</strong> #{revision.id}
                                                                                </p>
                                                                                <p className="font-THICCCBOI-Medium text-lg">
                                                                                    <strong>Message:</strong> {revision.message}
                                                                                </p>
                                                                                {renderRevisionFiles(revision.files)}
                                                                                <p className="font-THICCCBOI-Medium text-lg">
                                                                                    <strong>Created At:</strong> {new Date(revision.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p>Order not found</p>
                        )
                    )}
                </div>
            </section>

            {/* Message Modal */}
            {isMessageModalOpen && (
                <CustomModal isOpen={isMessageModalOpen} onClose={closeMessageModal} message="Send Your Revision">
                    <MessageModal
                        selectedOrderItem={selectedOrderItem}
                        setRevisions={setRevisions}
                        setOrderStatus={setOrderStatus}
                        setOrderItems={setOrderItems}
                        onClose={closeMessageModal}
                    />
                </CustomModal>
            )}
        </main>
    );
};

export default OrderDetailPage;