import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from 'axios';
import "./Form.css";

function PostForm(props) {
    // Destructuring props
    const { onDataUpdate } = props;

    // State variables
    const [stringInput, setStringInput] = useState('');
    const [executionTime, setExecutionTime] = useState(0);

   // Handle form submission
const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    event.stopPropagation(); // Stop event propagation here to prevent bubbling
    const startTime = performance.now(); // Record start time

    try {
        // Make POST request to add data
        const response = await axios.post('https://backend-nodejs-assigment2.onrender.com/addData', {
            string: stringInput
        });

        const endTime = performance.now(); // Record end time
        const timeTaken = (endTime - startTime).toFixed(2); // Calculate execution time

        // Update state with execution time
        setExecutionTime(timeTaken);

        // Clear the input field after successful submission
        setStringInput('');

        // Call the onDataUpdate callback to notify the parent component
        onDataUpdate();

        // Display success message using SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'String added successfully!',
            text: `Execution time: ${timeTaken} ms`,
        });

    } catch (error) {
        console.error('Error:', error);
    }
};


    return (
        <div className="form_div">
            <h2>Create Post!</h2>
            <form onSubmit={handleSubmit}>
                <div className="inputContainer">
                    {/* Input field for entering string */}
                    <input
                        className="inputText"
                        type="text"
                        value={stringInput}
                        onChange={(e) => setStringInput(e.target.value)}
                        required
                    />
                    {/* Submit button */}
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default PostForm;
