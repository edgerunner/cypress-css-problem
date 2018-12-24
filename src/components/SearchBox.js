import React from "react";
import { useState } from "react";
import PT from "prop-types";
import { SearchResults } from "./SearchResults";
import cn from "classnames";
import "./SearchBox.css";

export default function SearchBox({
    engine, onSelect, className, render, selected: selectedProp
}) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    function inputChange({ target: { value } }) {
        setSearch(value);
        setResults(value ? engine(value) : []);
    }

    const [selected, setSelected] = useState(selectedProp);

    function resultSelect(selected) {
        onSelect(selected);
        setResults([]);
        if (render) {
            setSelected(selected);
        } else {
            setSearch(selected);
        }
    }

    function restoreSearch() {
        setSelected(null);
    }

    return (
        <div className={cn("search-box", className, { results: !!results.length })}>
            {
                selected
                    ? <span className="selected" onClick={restoreSearch}>{render(selected)}</span>
                    : <input
                        autoFocus
                        value={search}
                        type="text"
                        onChange={inputChange}
                        onFocus={inputChange} />
            }
            {
                results && results.length > 0
                    ? <SearchResults
                        highlight={search}
                        results={results}
                        onSelect={resultSelect}
                        render={render} />
                    : null
            }
        </div>
    );
}

SearchBox.propTypes = {
    engine: PT.func.isRequired,
    onSelect: PT.func,
    className: PT.string,
    render: PT.func,
    selected: PT.any,
};
