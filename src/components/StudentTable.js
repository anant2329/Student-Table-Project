import React from 'react';

const StudentTable = ({ students, onEdit, onDelete, sortConfig, onSort, totalCount, filteredCount }) => {
  return (
    <div className="table-container">
      <div className="table-stats">
        <span>Total: {totalCount} | Filtered: {filteredCount}</span>
      </div>
      
      <table className="students-table">
        <thead>
          <tr>
            <th onClick={() => onSort('name')}>
              Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => onSort('email')}>
              Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => onSort('age')}>
              Age {sortConfig.key === 'age' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.age}</td>
              <td className="actions">
                <button 
                  className="btn btn-edit"
                  onClick={() => onEdit(student)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => onDelete(student.id)}
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {students.length === 0 && (
        <div className="no-data">No students found</div>
      )}
    </div>
  );
};

export default StudentTable;
