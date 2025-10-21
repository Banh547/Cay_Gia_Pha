import React, { useState, useMemo } from 'react';
import Header from './Header';
import FamilyTree from './FamilyTree';
import MemberDetails from './MemberDetails';
import AddMemberModal from './AddMemberModal';

// --- DỮ LIỆU GIẢ LẬP CƠ SỞ DỮ LIỆU ---
const initialPersonalData = [
  { personal_id: 1, family_id: 1, name: "Ông Nội", gender: "Nam", birthday: "1940-01-10", birthplace: "Hà Nội", photo_url: "https://i.pravatar.cc/150?u=1", note: "Người đứng đầu gia tộc." },
  { personal_id: 2, family_id: 1, name: "Bà Nội", gender: "Nữ", birthday: "1942-05-20", birthplace: "Nam Định", photo_url: "https://i.pravatar.cc/150?u=2", note: "" },
  { personal_id: 3, family_id: 1, name: "Bố", gender: "Nam", birthday: "1965-08-15", birthplace: "Hà Nội", photo_url: "https://i.pravatar.cc/150?u=3", note: "" },
  { personal_id: 4, family_id: 1, name: "Mẹ", gender: "Nữ", birthday: "1968-11-30", birthplace: "Hải Phòng", photo_url: "https://i.pravatar.cc/150?u=4", note: "" },
  { personal_id: 5, family_id: 1, name: "Tôi", gender: "Nam", birthday: "1993-07-19", birthplace: "Hà Nội", photo_url: "https://i.pravatar.cc/150?u=5", note: "Nhân vật chính." }
];
const initialMarriageData = [
  { marriage_id: 1, husband_id: 1, wife_id: 2, start_date: "1960-12-01", status: "Đang kết hôn" },
  { marriage_id: 2, husband_id: 3, wife_id: 4, start_date: "1990-10-10", status: "Đang kết hôn" }
];
const initialParentChildData = [
  { pc_id: 1, parent_id: 1, child_id: 3, relationship: "Con ruột" },
  { pc_id: 2, parent_id: 2, child_id: 3, relationship: "Con ruột" },
  { pc_id: 3, parent_id: 3, child_id: 5, relationship: "Con ruột" },
  { pc_id: 4, parent_id: 4, child_id: 5, relationship: "Con ruột" },
];

const HomePage = ({ onLogout }) => {
  const [personals, setPersonals] = useState(initialPersonalData);
  const [marriages, setMarriages] = useState(initialMarriageData);
  const [parentChilds, setParentChilds] = useState(initialParentChildData);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  const familyTree = useMemo(() => {
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

    // --- THAY ĐỔI LOGIC TÌM GỐC ---
    // 1. Chỉ định ID của người gốc mà bạn muốn hiển thị
    const ROOT_PERSON_ID = 1; // ID của "Ông Nội"
    
    // 2. Tìm người gốc đó
    const rootPerson = findPersonById(ROOT_PERSON_ID);
    
    // 3. Xây dựng cây duy nhất từ người gốc này
    return buildTreeRecursive(rootPerson);

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
    // Với logic mới, hàm này chỉ thêm người vào danh sách, họ sẽ không hiển thị trừ khi được liên kết
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
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'flex-start', gap: '50px', padding: '20px' }}>
          {/* Chỉ hiển thị một cây duy nhất */}
          {familyTree && <FamilyTree data={familyTree} onMemberClick={handleMemberClick} />}
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