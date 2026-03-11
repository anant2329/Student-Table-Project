import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import StudentTable from './components/StudentTable';
import AddStudentForm from './components/AddStudentForm';
import EditStudentForm from './components/EditStudentForm';
import './App.css';

const initialStudents = [
  { id: 1, name: 'Anant Thakre', email: 'anant@gmail.com', age: 22 },
  { id: 2, name: 'Santhosh G', email: 'santhosh@gmail.com', age: 20 },
  { id: 3, name: 'Leena Chandra', email: 'leela2334@gmail.com', age: 24 },
];

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setStudents(initialStudents);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const addStudent = (studentData) => {
    setStudents([...students, { id: Date.now(), ...studentData }]);
    setShowAddForm(false);
  };

  const updateStudent = (studentData) => {
    setStudents(students.map(student => 
      student.id === editingStudent.id 
        ? { ...student, ...studentData }
        : student
    ));
    setEditingStudent(null);
  };

  const deleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const filteredStudents = students
    .filter(student => 
      student.name.toLowerCase().includes(filter.toLowerCase()) ||
      student.email.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredStudents);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `students_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Students Management</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddForm(true)}
            disabled={showAddForm}
          >
            + Add Student
          </button>
          <button className="btn btn-secondary" onClick={downloadExcel}>
            📥 Download Excel
          </button>
        </div>
      </header>

      <div className="container">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input"
          />
        </div>

        {showAddForm && (
          <AddStudentForm 
            onSubmit={addStudent}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {editingStudent && (
          <EditStudentForm 
            student={editingStudent}
            onSubmit={updateStudent}
            onCancel={() => setEditingStudent(null)}
          />
        )}

        <StudentTable
          students={filteredStudents}
          onEdit={setEditingStudent}
          onDelete={deleteStudent}
          sortConfig={sortConfig}
          onSort={(key) => {
            setSortConfig({
              key,
              direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
            });
          }}
          totalCount={students.length}
          filteredCount={filteredStudents.length}
        />
      </div>
    </div>
  );
}

export default App;
