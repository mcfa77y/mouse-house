import * as SmilesDrawer from 'smiles-drawer';
import { get_target_element_by_class } from '../grid/cs-grid-utils';

const setup_smiles = () => {
    const smilesDrawer = new SmilesDrawer.Drawer({
        width: 450,
        height: 300,
    });
    $('.multi-collapse.collapse').on('shown.bs.collapse', (event) => {
        const smiles_jq = $(event.target).find('.smiles:first');
        // const smiles_jq = $($('.smiles')[0]);
        const smiles_string = smiles_jq.text().trim();
        const canvas_id = smiles_jq.find('canvas').attr('id');

        SmilesDrawer.parse(smiles_string, (tree) => {
            smilesDrawer.draw(tree, canvas_id, 'light', false);
        });
    });
};

$(() => {
    setup_smiles();
    $(document).on('click', '.close-btn', (event) => {
        const targetElement = get_target_element_by_class(event, '.close-btn');
        targetElement.closest('.card').fadeOut({ complete() { $(this).remove(); } });
    });
});
