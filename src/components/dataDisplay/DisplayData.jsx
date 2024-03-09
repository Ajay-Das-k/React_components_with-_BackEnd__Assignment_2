import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import axios from 'axios';


function DisplayData({ shouldUpdate }) {
    const [data, setData] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedString, setEditedString] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://backend-nodejs-assigment2.onrender.com/allData');
                setData(response.data.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [shouldUpdate]);

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditedString(data[index].string);
    };

    const handleSave = async (index) => {
        try {
            // Make the API call to update the data
            await axios.put(`https://backend-nodejs-assigment2.onrender.com/edit-data/${data[index]._id}`, {
                string: editedString
            });
    
            // Update the data in the local state
            const updatedData = [...data];
            updatedData[index].string = editedString;
            setData(updatedData);
    
            // Reset editing state
            setEditingIndex(null);
    
            // Clear edited string
            setEditedString('');
    
            // Fetch updated data after saving
            fetchData();
    
            // Display success message
            Swal.fire({
                icon: 'success',
                title: 'Data Updated',
                text: 'The data has been successfully updated.',
            });
        } catch (error) {
            console.error('Error updating data:', error);
            // Display error message
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update data.',
            });
        }
    };
    return (
        <div>
            <h2>Display Data</h2>
            <table>
                <thead>
                    <tr>
                        <th>String</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>
                                {editingIndex === index ? (
                                    <input
                                        type="text"
                                        value={editedString}
                                        onChange={(e) => setEditedString(e.target.value)}
                                    />
                                ) : (
                                    item.string
                                )}
                            </td>
                            <td>
                                {editingIndex === index ? (
                                    <button onClick={() => handleSave(index)}>Save</button>
                                ) : (
                                    <button onClick={() => handleEdit(index)}>Edit</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DisplayData;
