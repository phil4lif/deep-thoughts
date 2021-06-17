import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {
    const [thoughtText, setThoughtText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        update(cache, { data: { addThought } }) {
            try {
                const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

                cache.writeQuery({
                    query: QUERY_THOUGHTS,
                    data: { thoughts: [addThought, ...thoughts] }
                });
            } catch (error) {
                console.error(error)
            }
            const { me } = cache.readQuery({ query: QUERY_ME });
            cache.writeQuery({
                query: QUERY_ME,
                data: { me: { ...me, thoughts: [...me.thoughts, addThought] } }
            })
        }
    });

    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setThoughtText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            await addThought({
                variables: { thoughtText }
            });
            setThoughtText('');
            setCharacterCount(0);
        } catch (error) {
            console.error(error)
        }

    }

    return (
        <div>
            <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>
            <form
                className='flex-row justify-center justify-space-between-md align-stretch'
                onSubmit={handleFormSubmit}
            >
                <textarea
                    value={thoughtText}
                    placeholder='A thought'
                    className='form-input col-12 col-md-9'
                    onChange={handleChange}
                ></textarea>
                <button className='btn col-12 col-md-3' type='submit'>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ThoughtForm;