import * as SmilesDrawer from 'smiles-drawer';

$(() => {
    const smiles_jq = $($('.smiles')[0]);
    const smiles_string = smiles_jq.text().trim();
    const canvas_id = smiles_jq.find('canvas').attr('id');
    const smilesDrawer = new SmilesDrawer.Drawer({
        width: 450,
        height: 300,
    });
    const collapse_id = $('.metadata_button')[0].attributes['data-target'].value

    $(`${collapse_id}`).on('shown.bs.collapse', () => {
        SmilesDrawer.parse(smiles_string, (tree) => {
            smilesDrawer.draw(tree, canvas_id, 'light', false);
        });
    });
});
