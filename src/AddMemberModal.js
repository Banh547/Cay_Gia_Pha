import React, { useState, useEffect } from 'react';
import './AddMemberModal.css';

const AddMemberModal = ({ isOpen, onClose, onSave, title }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <div className="form-group">
          <label>Họ và tên:</label>
          <input name="name" onChange={handleChange} placeholder="Tên thành viên mới" />
        </div>
         <div className="form-group">
          <label>Giới tính:</label>
          <input name="gender" onChange={handleChange} placeholder="Nam / Nữ" />
        </div>
        <div className="form-group">
          <label>Ngày sinh:</label>
          <input name="birthday" onChange={handleChange} placeholder="YYYY-MM-DD" />
        </div>
        <div className="form-group">
          <label>Nơi sinh:</label>
          <input name="birthplace" onChange={handleChange} placeholder="Tên thành phố/tỉnh" />
        </div>
        <div className="form-group">
          <label>Link Avatar:</label>
          <input name="photo_url" onChange={handleChange} placeholder="URL hình ảnh" />
        </div>
        <div className="form-group">
          <label>Ghi chú:</label>
          <textarea name="note" onChange={handleChange} />
        </div>
        <div className="modal-actions">
          <button onClick={handleSave} className="action-button">Lưu</button>
          <button onClick={onClose} className="action-button secondary">Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;