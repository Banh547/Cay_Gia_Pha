import React, { useState, useEffect } from 'react';
import './MemberDetails.css';

const MemberDetails = ({ person, onClose, onUpdateMember, onAddChild, onAddSpouse, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...person });

  useEffect(() => {
    setFormData({ ...person });
    setIsEditing(false);
  }, [person]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdateMember(formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(person.personal_id);
  };

  if (!person) {
    return (
      <div className="details-panel placeholder">
        <h3>Vui lòng chọn một thành viên để xem thông tin</h3>
      </div>
    );
  }

  return (
    <div className="details-panel">
      <button onClick={onClose} className="close-button">×</button>
      
      {isEditing ? (
        <div className="edit-form">
          <h2>Chỉnh sửa thông tin</h2>
          <div className="form-group">
            <label>Họ và tên:</label>
            <input name="name" value={formData.name || ''} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Giới tính:</label>
            <input name="gender" value={formData.gender || ''} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Ngày sinh:</label>
            <input name="birthday" value={formData.birthday || ''} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Nơi sinh:</label>
            <input name="birthplace" value={formData.birthplace || ''} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Link Avatar:</label>
            <input name="photo_url" value={formData.photo_url || ''} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Ghi chú:</label>
            <textarea name="note" value={formData.note || ''} onChange={handleInputChange} />
          </div>
          <button onClick={handleSave} className="action-button">Lưu</button>
          <button onClick={() => setIsEditing(false)} className="action-button secondary">Hủy</button>
        </div>
      ) : (
        <div className="view-mode">
          <div className="details-header">
            <img src={person.photo_url} alt={person.name} className="avatar" />
            <h2>{person.name}</h2>
          </div>
          <div className="details-body">
            <div className="detail-item">
              <strong>Giới tính:</strong>
              <span>{person.gender || 'Không rõ'}</span>
            </div>
            <div className="detail-item">
              <strong>Ngày sinh:</strong>
              <span>{person.birthday || 'Không rõ'}</span>
            </div>
            <div className="detail-item">
              <strong>Nơi sinh:</strong>
              <span>{person.birthplace || 'Không rõ'}</span>
            </div>
            <div className="detail-item">
              <strong>Ghi chú:</strong>
              <p className="notes">{person.note || 'Không có'}</p>
            </div>
          </div>
          <div className="actions-container">
            <button onClick={() => setIsEditing(true)} className="action-button">Chỉnh sửa</button>
            {person.gender === 'Nam' && <button onClick={onAddSpouse} className="action-button secondary">Thêm Vợ</button>}
            {person.gender === 'Nữ' && <button onClick={onAddSpouse} className="action-button secondary">Thêm Chồng</button>}
            <button onClick={onAddChild} className="action-button secondary">Thêm Con</button>
            <button onClick={handleDelete} className="action-button danger">Xóa</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetails;