import React from 'react';
import './recipe.css'


const Recipe = ({ recipe }) => {
    return (
        <div className="sm:w-3/5 h-[calc(100vh-64px)] hidden sm:block rounded-lg bg-c2 p-3 overflow-auto pb-5">
            {recipe.length > 0 ? (
                <div dangerouslySetInnerHTML={{ __html: recipe }} />
            ) : (
                <p>No recipe available.</p>
            )}
        </div>
    );
};

export default Recipe;
