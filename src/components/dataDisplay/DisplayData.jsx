import React, { useState, useEffect } from 'react';
import "./DisplayData.css"
import Swal from "sweetalert2";
import axios from 'axios';

function DisplayData({ shouldUpdate }) {
    // State variables
    const [data, setData] = useState([]); // Store fetched data
    const [editingIndex, setEditingIndex] = useState(null); // Track index being edited
    const [editedString, setEditedString] = useState(''); // Store edited string
    const [resetTrigger, setResetTrigger] = useState(false); // State variable to trigger re-render

    useEffect(() => {
        // Function to fetch data from the server
        const fetchData = async () => {
            try {
                const response = await axios.get('https://backend-nodejs-assigment2.onrender.com/allData');
                setData(response.data.data); // Update state with fetched data
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData(); // Call fetchData when the component mounts or shouldUpdate changes
    }, [shouldUpdate, resetTrigger]); // Include resetTrigger in the dependency array

    // Handle editing of a string
    const handleEdit = (index) => {
        setEditingIndex(index); // Set the index being edited
        setEditedString(data[index].string); // Set the edited string to the current value
    };

    // Handle saving the edited string
    const handleSave = async (index) => {
        try {
            const startTime = performance.now(); // Start measuring execution time

            // Make the API call to update the data
            await axios.put(`https://backend-nodejs-assigment2.onrender.com/edit-data/${data[index]._id}`, {
                string: editedString
            });

            // Calculate execution time
            const endTime = performance.now();
            const executionTime = (endTime - startTime).toFixed(2);

            // Update the data in the local state
            const updatedData = [...data];
            updatedData[index].string = editedString;
            setData(updatedData);

            // Reset editing state
            setEditingIndex(null);

            // Clear edited string
            setEditedString('');

            // Display success message with execution time
            Swal.fire({
                icon: 'success',
                title: 'Data Updated',
                text: 'The data has been successfully updated.',
                footer: `Execution time: ${executionTime} milliseconds`,
            });

            // Wait for 1 second before fetching updated data
            setTimeout(() => {
                fetchData(); // Fetch updated data after saving
            }, 1000);
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

    // Handle deleting a string
    const handleDelete = async (index) => {
        try {
            const startTime = new Date(); // Start measuring execution time

            // Make the API call to delete the data
            await axios.delete(`https://backend-nodejs-assigment2.onrender.com/deleteData/${data[index]._id}`);

            // Remove the deleted data from the local state
            const updatedData = [...data];
            updatedData.splice(index, 1);
            setData(updatedData);

            const endTime = new Date(); // End measuring execution time
            const executionTime = endTime - startTime; // Calculate execution time

            // Display success message with execution time
            Swal.fire({
                icon: 'success',
                title: 'Data Deleted',
                text: 'The data has been successfully deleted.',
                footer: `Execution time: ${executionTime} milliseconds`,
            });
        } catch (error) {
            console.error('Error deleting data:', error);
            // Display error message
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete data.',
            });
        }
    };

    // Handle resetting all data
    const handleResetData = async () => {
        try {
            const startTime = performance.now(); // Start measuring execution time

            // Make the API call to reset data
            await axios.get('https://backend-nodejs-assigment2.onrender.com/resetData');
            setResetTrigger(prevState => !prevState); // Toggle resetTrigger to force re-render
            const endTime = performance.now(); // Stop measuring execution time
            const executionTime = (endTime - startTime).toFixed(2); // Calculate execution time

            // Display success message with execution time in footer
            Swal.fire({
                icon: 'success',
                title: 'Data Reset',
                text: 'All data has been successfully reset.',
                footer: `Execution time: ${executionTime} milliseconds`
            });

            fetchData(); // Fetch updated data after resetting

        } catch (error) {
            console.error('Error resetting data:', error);
            // Display error message
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to reset data.',
            });
        }
    };

    return (
        <div className='tableContainer'>
            <h2>Data</h2>
            {data.length > 0 && (
                <button className='reset_button' onClick={handleResetData}>Reset Data</button>
            )}

            <table className='Datatable'>
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
                                   <div className='inputContainer' >
                                <input
                                   type="text"
                                   value={editedString}
                                   onChange={(e) => setEditedString(e.target.value)}
                               /></div> 
                                ) : (
                                    item.string
                                )}
                            </td>
                            <td>
                                {editingIndex === index ? (
                                    <>
                                        <button onClick={() => handleSave(index)}>Save</button>
                                        <button onClick={() => setEditingIndex(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(index)}>Edit</button>
                                        <button onClick={() => handleDelete(index)}>Delete</button>
                                    </>
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
