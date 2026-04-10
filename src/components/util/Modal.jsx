import { useEffect } from 'react';

import './modal.css';

export default function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if(e.key === 'Escape') onClose();
        }

        if(isOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.addEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if(!isOpen) return null;

    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-container' onClick={(e) => e.stopPropagation()}>
                <div className='modal-header'>
                    <h3>{title}</h3>

                    <button className="primary log-action cancel" onClick={onClose}>Cancel</button>

                </div>

                <div className='modal-body'>
                    {children}
                </div>
            </div>
        </div>
    )
}