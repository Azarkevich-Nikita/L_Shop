import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { createPortal } from 'react-dom';

import '../style/modalCard.scss'

interface modalProps {
    title: number;
    price: number;
    created_from: string;
    is_stock: boolean;
    created_date: string
    property: Array<string>;
    image_url: Array<string>;
}

function Modal({ onClose }: { onClose: () => void }) {
    const [searchParams] = useSearchParams();
    const [modalInfo, setModalInfo] = useState<modalProps | null>(null);

    const id = searchParams.get('id');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/catalog/${id}`)
            const data = await response.json();

            setModalInfo(data);
        }

        fetchData();
    }, [id])

    return createPortal(
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <img src={modalInfo?.image_url?.[0]} />
                <div className='text'>
                    <div className='row'>
                        <div>{modalInfo?.title}</div>
                        <div>{modalInfo?.price} руб.</div>
                    </div>
                    <div className='row'>
                        <div>Страна-производитель</div>
                        <div>{modalInfo?.created_from}</div>
                    </div>
                    <div className='row'>
                        <div>В наличии</div>
                        <div>{modalInfo?.is_stock ? 'Да' : 'Нет'}</div>
                    </div>
                    <div className='row'>
                        <div>Дата производства</div>
                        <div>{modalInfo?.created_date}</div>
                    </div>
                    <div className='hr' />
                    <div className='row'>
                        <div className='column'>{modalInfo?.property.map(prop => (
                            <div>{prop}</div>
                        ))}</div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default Modal;