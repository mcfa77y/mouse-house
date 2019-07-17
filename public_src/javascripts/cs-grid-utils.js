export function get_target_element_by_class(event, klass) {
    const clickedElement = $(event.target);
    let targetElement = clickedElement.closest(klass);
    if (targetElement.length === 0) {
        targetElement = clickedElement.children().closest(klass);
    }
    return targetElement;
}

export const GRID_MODE = {
    CREATE_CARD: 1,
    TAG_CELL: 2,
};

export const CELL_TAG = {
    GREEN: 'green',
    RED: 'red',
    BLACK: 'black',
    BLUE: 'blue',
    GREY: 'grey',
    TEAL: 'teal',
    YELLOW: 'yellow',
    SELECTED: 'selected_cell',
    UNSELECTED: 'unselected_cell',
};


export const error = ({ response }) => {
    const results = $('#results');
    let warning = `<div class="alert alert-warning" role="alert">${JSON.stringify(arguments[0], null, 2)}</div>`;
    if (response !== undefined) {
        warning = `<div class="alert alert-warning" role="alert">${response.data.message}</div>`;
    }
    results.html(warning);
}