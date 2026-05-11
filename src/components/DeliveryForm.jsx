import React, { useState } from 'react';
import './DeliveryForm.css';
import { CreditCard, User, Phone, Edit2, Calendar, HeadphonesIcon, Truck, Target, FileText, MapPin, Loader } from 'lucide-react';

const DeliveryForm = () => {
  const [formData, setFormData] = useState({
    senderMerchantAccount: '',
    senderDriverNumber: '',
    senderFullName: '',
    senderPhone: '',
    senderAddress: '',
    recipientFullName: '',
    recipientPhone: '',
    recipientAddress: '',
    packageDescription: '',
    collectionTime: 'NOW' // Default
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // REPLACE THIS with your Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPyc8u16gvKddlqvx-vZxvDSQJH-WpuHexJ2PnaBeswNY9giYgMTcvudAl9V7iDpKJ/exec';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCollectionTime = (time) => {
    setFormData(prev => ({ ...prev, collectionTime: time }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE') {
      alert("Please add your Google Apps Script URL in DeliveryForm.jsx");
      setIsSubmitting(false);
      return;
    }

    try {
      // Send as text/plain to avoid CORS preflight issues with Google Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(formData)
      });

      // With no-cors or basic fetch to Apps Script, response might be opaque, so we check if it resolved
      setSubmitStatus('success');
      setFormData({
        senderMerchantAccount: '',
        senderDriverNumber: '',
        senderFullName: '',
        senderPhone: '',
        senderAddress: '',
        recipientFullName: '',
        recipientPhone: '',
        recipientAddress: '',
        packageDescription: '',
        collectionTime: 'NOW'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page-wrapper">
      <div className="form-container">
        <div className="form-header">
          <h1>DELIVERY REQUEST</h1>
          <p>Please complete the details below to schedule your<br />delivery.</p>
        </div>

        {submitStatus === 'success' && (
          <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            Delivery request submitted successfully!
          </div>
        )}

        {submitStatus === 'error' && (
          <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid #dc2626', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            There was an error submitting the request. Please try again.
          </div>
        )}

        <form className="delivery-form" onSubmit={handleSubmit}>
          {/* Sender Information */}
          <div className="form-section">
            <div className="section-title">
              <User size={18} className="section-icon" />
              <h2>Sender Information</h2>
            </div>
            
            <div className="form-group">
              <label>Merchant Account Number</label>
              <div className="input-wrapper">
                <CreditCard size={18} className="input-icon" />
                <input type="text" name="senderMerchantAccount" value={formData.senderMerchantAccount} onChange={handleChange} placeholder="Enter the merchant's account number" required />
              </div>
            </div>

            <div className="form-group">
              <label>Driver's Number</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input type="text" name="senderDriverNumber" value={formData.senderDriverNumber} onChange={handleChange} placeholder="ID of assigned driver" />
              </div>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="senderFullName" value={formData.senderFullName} onChange={handleChange} placeholder="Enter the sender's name" className="input-no-icon" required />
            </div>

            <div className="form-group">
              <label>Phone number</label>
              <div className="input-wrapper">
                <Phone size={18} className="input-icon" />
                <input type="tel" name="senderPhone" value={formData.senderPhone} onChange={handleChange} placeholder="(000) 000 0000" required />
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <div className="textarea-wrapper">
                <textarea name="senderAddress" value={formData.senderAddress} onChange={handleChange} placeholder="Street, City, State, Zip Code" required></textarea>
                <Edit2 size={16} className="edit-icon" />
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div className="form-section">
            <div className="section-title">
              <MapPin size={18} className="section-icon" />
              <h2>Recipient Information</h2>
            </div>
            
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="recipientFullName" value={formData.recipientFullName} onChange={handleChange} placeholder="Enter the recipient's name" className="input-no-icon" required />
            </div>

            <div className="form-group">
              <label>Phone number</label>
              <div className="input-wrapper">
                <Phone size={18} className="input-icon" />
                <input type="tel" name="recipientPhone" value={formData.recipientPhone} onChange={handleChange} placeholder="(000) 000 0000" required />
              </div>
            </div>

            <div className="form-group">
              <label>Address</label>
              <div className="textarea-wrapper">
                <textarea name="recipientAddress" value={formData.recipientAddress} onChange={handleChange} placeholder="Street, City, State, Zip Code" required></textarea>
                <Edit2 size={16} className="edit-icon" />
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="form-section">
            <div className="section-title">
              <FileText size={18} className="section-icon" />
              <h2>Delivery Details</h2>
            </div>
            
            <div className="form-group">
              <label>Package Description</label>
              <div className="textarea-wrapper">
                <textarea name="packageDescription" value={formData.packageDescription} onChange={handleChange} placeholder="What are we going to collect and deliver?" required></textarea>
                <Edit2 size={16} className="edit-icon" />
              </div>
            </div>

            <div className="form-group">
              <label>When should we start the collection?</label>
              <div className="collection-buttons">
                <button 
                  type="button" 
                  className={`btn-pickup ${formData.collectionTime === 'NOW' ? 'active' : 'inactive'}`}
                  onClick={() => handleCollectionTime('NOW')}
                  style={formData.collectionTime !== 'NOW' ? { backgroundColor: 'transparent', border: '1px solid #3A3836', color: '#FAFAF9' } : {}}
                >
                  <Target size={16} /> Pick up NOW
                </button>
                <button 
                  type="button" 
                  className={`btn-schedule ${formData.collectionTime === 'LATER' ? 'active' : 'inactive'}`}
                  onClick={() => handleCollectionTime('LATER')}
                  style={formData.collectionTime === 'LATER' ? { backgroundColor: '#F2B705', color: '#110e0b', border: 'none' } : {}}
                >
                  <Calendar size={16} /> Schedule for Later
                </button>
              </div>
            </div>
          </div>

          <button type="button" className="btn-support">
            <HeadphonesIcon size={18} className="support-icon" />
            <span>Need help or want to cancel? Call Support: <strong>+1 (800) HUNGER-SUCKS</strong></span>
          </button>

          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader className="spin-icon" size={20} /> : <Truck size={20} />}
            {isSubmitting ? 'SUBMITTING...' : 'START COLLECTION NOW'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryForm;
