interface Sub_Mod {
    modificationSetting: string,
    modificationType: string
}
interface Mods {
    modifications: Sub_Mod[],
    molWeight: number,
    reducedCyscCount: number

}
export const get_level_n_mods = (mod_mw: Mods[], level = 0): Set<Sub_Mod> => {
    const result = mod_mw.reduce((acc, cur) => {
        acc.add(cur.modifications[level]);
        return acc;
    }, new Set<Sub_Mod>());
    return result;
}

export const get_child_mods = (mod_mw: Mods[]): Set<Sub_Mod> => {
    const result = mod_mw
        .reduce((acc, cur) => {
            cur.modifications.reduce((acc2, mod, index) => {
                if (index !== 0) {
                    const setting = mod.modificationSetting;
                    const type = mod.modificationType;
                    acc2.add(mod);
                }
                return acc2
            }, acc)
            return acc;
        }, new Set<Sub_Mod>());
    return result;
}


export const get_level2_mods = (mod_mw: Mods[]) => {
    const root_mod_set = get_level_n_mods(mod_mw, 0);


    const foo = [...root_mod_set].reduce((acc, m) => {
        return acc.set(m.modificationType, new Map());
    }, new Map<string, Map<string, Set<string>>>());

    const sorted_mod_mw_map = {};

    const result_map = mod_mw.reduce((acc, m) => {
        const root_mod_name = m.modifications[0].modificationType;
        const rm_map = acc.get(root_mod_name);
        const ch_m_set = get_child_mods([m]);
        const ch_m_list = [...ch_m_set];

        // console.log(root_mod_name);
        let sorted_mod_name_list = [];

        let fizz = new Map<string, Set<string>>();
        if (ch_m_list.length == 0) {
            fizz.set('none', new Set<string>(['none']));
            // console.log("\tnone\tnone");
            sorted_mod_name_list.push("none_none");
        }
        else {
            fizz = ch_m_list.reduce((acc2, ch_m) => {
                // console.log("\t" + ch_m.modificationType + "\t" + ch_m.modificationSetting);
                let type_mod_list = acc2.get(ch_m.modificationType);
                if (type_mod_list == undefined) {
                    acc2.set(ch_m.modificationType, new Set<string>());
                    type_mod_list = acc2.get(ch_m.modificationType);
                }
                type_mod_list.add(ch_m.modificationSetting);
                acc2.set(ch_m.modificationType, type_mod_list);
                return acc2;
            }, rm_map);

            sorted_mod_name_list = ch_m_list.reduce((acc2, ch_m) => {
                acc2.push(ch_m.modificationType + "_" + ch_m.modificationSetting);
                return acc2
            }, []).sort();

        }
        if (sorted_mod_mw_map[root_mod_name.toLocaleLowerCase()] == undefined) {
            sorted_mod_mw_map[root_mod_name.toLocaleLowerCase()] = {}
        }
        sorted_mod_mw_map[root_mod_name.toLocaleLowerCase()][sorted_mod_name_list.join("_").toLowerCase()] = m.molWeight;

        acc.set(root_mod_name, new Map([...rm_map, ...fizz]));
        return acc;
    }, foo);

    const html_data = [];
    for (let [root_mod_name, ch_mod_map] of result_map) {
        const fuzz = { root_mod_name, ch_mod_list: [] };

        for (let [ch_mod_type, ch_setting_list] of ch_mod_map) {
            const fizz = { ch_mod_type, ch_setting_list: [...ch_setting_list] }
            if (fizz.ch_setting_list.length == 1) {
                fizz.ch_mod_type += "_" + fizz.ch_setting_list[0];
                fizz.ch_setting_list = [];
            }
            fuzz.ch_mod_list.push(fizz);
        }
        html_data.push(fuzz)
    }
    // collapse ch_mod_types that only have one setting

    return { result_map, html_data, sorted_mod_mw_map };
}
