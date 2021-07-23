import {EntityCategory} from "./categorySlice";
import CategoryCheckBox from "./CategoryCheckBox";
import FlashMessage from "../../FlashMessage";

interface Props {
    categories: EntityCategory[]
}

export function CategoriesList({categories}: Props) {

    if (categories && categories.length === 0) {
        return <FlashMessage variant="warning" message="No categories found"/>
    }

    return (
        <div className="content">
            <dl>
                {categories.map(c => {
                    return (
                        <div key={c.id}>
                            <dt><CategoryCheckBox category={{
                                id: c.id,
                                name: c.name,
                                totalChildren: c.children && c.children.length || 0,
                                parent: null,
                                created_at: c.created_at
                            }
                            }/></dt>
                            {c.children && c.children.length > 0 && c.children.map(child => {
                                return <dd key={child.id}><CategoryCheckBox category={{
                                    id: child.id,
                                    name: child.name,
                                    parent: {id: c.id, name: c.name, created_at: c.created_at},
                                    created_at: child.created_at
                                }}/></dd>
                            })}
                        </div>
                    )
                })}

            </dl>
        </div>
    )
}
