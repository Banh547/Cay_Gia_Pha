import React, { useState, useMemo } from 'react';
import Header from './Header';
import FamilyTree from './FamilyTree';
import MemberDetails from './MemberDetails';
import AddMemberModal from './AddMemberModal';

// Dữ liệu ban đầu có thể để trống
const initialPersonalData = [];
const initialMarriageData = [];
const initialParentChildData = [];

const HomePage = ({ onLogout }) => {
  const [personals, setPersonals] = useState(initialPersonalData);
  const [marriages, setMarriages] = useState(initialMarriageData);
  const [parentChilds, setParentChilds] = useState(initialParentChildData);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  const familyTrees = useMemo(() => {
    if (personals.length === 0) {
      return [];
    }
    const findPersonById = (id) => personals.find(p => p.personal_id === id);
    const findSpouses = (personId) => {
      return marriages
        .filter(m => m.husband_id === personId || m.wife_id === personId)
        .map(m => {
          const spouseId = m.husband_id === personId ? m.wife_id : m.husband_id;
          return findPersonById(spouseId);
        }).filter(Boolean);
    };
    const findChildren = (parentId) => parentChilds.filter(pc => pc.parent_id === parentId).map(pc => findPersonById(pc.child_id)).filter(Boolean);
    const buildTreeRecursive = (person) => {
      if (!person) return null;
      const spouses = findSpouses(person.personal_id);
      const children = findChildren(person.personal_id);
      return {
        id: person.personal_id,
        name: person.name,
        avatar: person.photo_url,
        spouses: spouses.map(s => ({ id: s.personal_id, name: s.name, avatar: s.photo_url })),
        children: children.map(child => buildTreeRecursive(child))
      };
    };
    const allChildIds = new Set(parentChilds.map(pc => pc.child_id));
    const rootPersons = personals.filter(p => !allChildIds.has(p.personal_id));
    return rootPersons.map(root => buildTreeRecursive(root));
  }, [personals, marriages, parentChilds]);

  const handleMemberClick = (personNode) => {
    const fullPersonData = personals.find(p => p.personal_id === personNode.id);
    setSelectedMember(fullPersonData);
  };
  
  const handleCloseDetails = () => setSelectedMember(null);

  const handleUpdateMember = (updatedPerson) => {
    setPersonals(personals.map(p => p.personal_id === updatedPerson.personal_id ? updatedPerson : p));
    setSelectedMember(updatedPerson);
  };

  const handleAddChild = (newPersonData) => {
    const newPerson = { ...newPersonData, personal_id: Date.now(), family_id: 1 };
    setPersonals(prev => [...prev, newPerson]);
    setParentChilds(prev => [...prev, { pc_id: Date.now(), parent_id: selectedMember.personal_id, child_id: newPerson.personal_id, relationship: 'Con ruột' }]);
  };

  const handleAddSpouse = (newPersonData) => {
    const newPerson = { ...newPersonData, personal_id: Date.now(), family_id: 1 };
    setPersonals(prev => [...prev, newPerson]);
    const newMarriage = {
      marriage_id: Date.now(),
      husband_id: selectedMember.gender === 'Nam' ? selectedMember.personal_id : newPerson.personal_id,
      wife_id: selectedMember.gender === 'Nữ' ? selectedMember.personal_id : newPerson.personal_id,
      status: 'Đang kết hôn'
    };
    setMarriages(prev => [...prev, newMarriage]);
  };
  
  const handleDeleteMember = (memberId) => {
    if (window.confirm("Việc này cũng sẽ xóa tất cả mối quan hệ hôn nhân và con cái của người này. Bạn có chắc không?")) {
      setPersonals(personals.filter(p => p.personal_id !== memberId));
      setMarriages(marriages.filter(m => m.husband_id !== memberId && m.wife_id !== memberId));
      setParentChilds(parentChilds.filter(pc => pc.parent_id !== memberId && pc.child_id !== memberId));
      setSelectedMember(null);
    }
  };

  const handleAddNewPerson = (newPersonData) => {
    const newPerson = { ...newPersonData, personal_id: Date.now(), family_id: 1 };
    setPersonals(prev => [...prev, newPerson]);
  };

  const handleSaveModal = (data) => {
    if (modalMode === 'addChild') handleAddChild(data);
    else if (modalMode === 'addSpouse') handleAddSpouse(data);
    else if (modalMode === 'addRootPerson') handleAddNewPerson(data);
  };

  return (
    <div>
      <Header onLogout={onLogout} onAddNewPerson={() => setModalMode('addRootPerson')} />
      <div style={{ display: 'flex', height: 'calc(100vh - 70px)' }}>
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '50px', padding: '20px' }}>
          
          {familyTrees.length > 0 ? (
            familyTrees.map(tree => (
              tree && <FamilyTree key={tree.id} data={tree} onMemberClick={handleMemberClick} />
            ))
          ) : (
            // --- THAY ĐỔI Ở ĐÂY ---
            // Chỉ hiển thị thông báo, không có nút bấm
            <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
              <h2>Chưa có dữ liệu gia phả</h2>
              <p>Sử dụng nút "Thêm Thành Viên" trên thanh công cụ để bắt đầu.</p>
            </div>
          )}
        </div>
        
        <MemberDetails 
          person={selectedMember} 
          onClose={handleCloseDetails} 
          onUpdateMember={handleUpdateMember}
          onAddChild={() => setModalMode('addChild')}
          onAddSpouse={() => setModalMode('addSpouse')}
          onDelete={handleDeleteMember}
        />
      </div>
      
      <AddMemberModal 
        isOpen={modalMode !== null}
        onClose={() => setModalMode(null)}
        onSave={handleSaveModal}
        title={
          modalMode === 'addChild' ? `Thêm Con cho ${selectedMember?.name}` :
          modalMode === 'addSpouse' ? `Thêm Vợ/Chồng cho ${selectedMember?.name}` :
          'Thêm Thành Viên Mới'
        }
      />
    </div>
  );
};

export default HomePage;