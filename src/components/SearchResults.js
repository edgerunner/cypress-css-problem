import React from "react";
import PT from "prop-types";

export function SearchResults({ results, highlight, onSelect, render }) {
    function selectHandler(result) {
        return function () { onSelect(result); };
    }

    return (
        <ul className="search-results">
            {results.map((result) =>
                <li onClick={selectHandler(result)} key={result}>
                    <SearchResult
                        key={result}
                        highlight={highlight}>
                        {render(result)}
                    </SearchResult>
                </li>
            )}
        </ul>
    );
}

SearchResults.propTypes = {
    results: PT.array,
    highlight: PT.string,
    render: PT.func,
    onSelect: PT.func
};

SearchResults.defaultProps = { render: (x) => x };

// TODO: dummy component, replace with real counterpart
function SearchResult({ children }) { return children; }
