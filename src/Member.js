import React from 'react';

const Member = ({ person, onMemberClick }) => {
  const handleMemberClick = (e, member) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra các phần tử cha
    onMemberClick(member);
  };

  return (
    <div className="member">
      {/* 1. Nhóm các cha/mẹ vào một div chung */}
      <div className="parents">
        <div className="person" onClick={(e) => handleMemberClick(e, person)}>
          <div className="name">{person.name}</div>
        </div>
        
        {/* 2. Vợ/chồng giờ cũng là một khối "person" riêng biệt */}
        {person.spouses && person.spouses.map(spouse => (
          <div 
            key={spouse.id}
            className="person spouse" 
            onClick={(e) => handleMemberClick(e, spouse)}
          >
            <div className="name">{spouse.name}</div>
          </div>
        ))}
      </div>

      {/* Phần con cái không thay đổi cấu trúc */}
      {person.children && person.children.length > 0 && (
        <div className="children">
          {person.children.map(child => (
            child && <Member key={child.id} person={child} onMemberClick={onMemberClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Member;