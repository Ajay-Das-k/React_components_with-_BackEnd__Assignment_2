import React, { useState } from "react";
import Swal from "sweetalert2";
import "./Form.css";
import axios from 'axios';

function PostForm({ onDataAdded }) { // Accepting the onDataAdded prop
    const [stringInput, setStringInput] = useState('');
    const [response, setResponse] = useState('');
    const [executionTime, setExecutionTime] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation(); // Stop event propagation here

        const startTime = performance.now(); // Record start time

        try {
            const response = await axios.post('https://backend-nodejs-assigment2.onrender.com/addData', {
                string: stringInput
            });

            setResponse(JSON.stringify(response.data));

            const endTime = performance.now(); // Record end time
            const timeTaken = (endTime - startTime).toFixed(2); // Calculate execution time

            setExecutionTime(timeTaken);

            // Display success message in sweet alert
            Swal.fire({
                icon: 'success',
                title: 'String added successfully!',
                text: `Execution time: ${timeTaken} ms`,
            });

            // Call the onDataAdded callback to notify the parent component
            onDataAdded();

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="form_div">
            <h2>Create Post</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="string">String:</label>
                <input
                    type="text"
                    value={stringInput}
                    onChange={(e) => setStringInput(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default PostForm;
