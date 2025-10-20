import React from 'react';
import Member from './Member';
import './FamilyTree.css';

const FamilyTree = ({ data, onMemberClick }) => {
  if (!data) {
    return <div className="tree-container">Đang tải cây...</div>;
  }
  return (
    <div className="tree-container">
      <Member person={data} onMemberClick={onMemberClick} />
    </div>
  );
};

export default FamilyTree;