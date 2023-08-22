import React, { useEffect, useState } from 'react';
import Item from './Item';

import Loading from './Loading';



export default function ItemsList({ repoAddress }) {
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState();

    useEffect(() => {
        if (repoAddress) {
            setIsLoading(true);
            fetch(`/api/contents/${repoAddress}`)
                .then(r => r.json())
                .then(items => {
                    setItems(items);
                    setIsLoading(false)
                })
                .catch(err => alert('There was an error loading the content. Please try again.'));
        }
        else
            setItems(undefined);

    }, [repoAddress])

    return isLoading ? <Loading /> : (
        items?.map(item => <Item {...item} />)
    )
}