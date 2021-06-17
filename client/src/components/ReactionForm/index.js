import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_REACTION } from '../../utils/mutations';

const ReactionForm = ({ thoughtId }) => {
    console.log(thoughtId)
    const [reactionBody, setBody] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    console.log(reactionBody)
    const [addReaction, { error }] = useMutation(ADD_REACTION);
    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setBody(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            await addReaction({
                variables: { reactionBody, thoughtId }
            })
            setBody('');
            setCharacterCount(0);
        } catch (error) {
            console.error(error)
        }

    };
    return (
        <div>
            <p className="m-0">
                Character Count: {characterCount}/280
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>
            <form
                onSubmit={handleFormSubmit}
                className="flex-row justify-center justify-space-between-md align-stretch">
                <textarea
                    onChange={handleChange}
                    value={reactionBody}
                    placeholder="Leave a reaction to this thought..."
                    className="form-input col-12 col-md-9"
                ></textarea>

                <button className="btn col-12 col-md-3" type="submit">
                    Submit
        </button>
            </form>
        </div>
    )
}

export default ReactionForm;