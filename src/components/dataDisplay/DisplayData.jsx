import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DisplayData() {
    const [data, setData] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://backend-nodejs-assigment2.onrender.com/allData');
                setData(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditValue(data[index].string);
    };

    const handleSave = async (index) => {
        try {
            await axios.put(`https://backend-nodejs-assigment2.onrender.com/data/${data[index]._id}`, { string: editValue });
            const newData = [...data];
            newData[index].string = editValue;
            setData(newData);
            setEditingIndex(null);
        } catch (error) {
            console.error('Error:', error);
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
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
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
