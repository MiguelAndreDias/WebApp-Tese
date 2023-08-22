import React, { Suspense, useState, lazy } from 'react';
import { Button } from 'rsuite';
import Loading from './Loading';
import styles from './Item.module.scss';

const ReactJson = lazy(() => import('react-json-view'));

export default function Item({
    name,
    path,
    sha,
    size,
    url,
    html_url,
    git_url,
    download_url,
    type,
    _links: {
        self,
        git,
        html
    }
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [jsonString, setJsonString] = useState(null);

    const onClick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        setIsOpen(!isOpen);

        if (jsonString) return;

        setIsLoading(true);
        fetch(`/api/adl/${path}`)
            .then(r => r.json())
            .then(items => {
                setJsonString(items);
                setIsLoading(false)
            })
            .catch(err => alert('There was an error loading the content. Please try again.'));
    }


    return (
        <div className={styles.ItemComponent} key={git_url}>
            <Button onClick={onClick}>
                {name}
            </Button>
            {isLoading && <Loading />}
            {isOpen && jsonString && <Suspense> <ReactJson src={jsonString}  collapsed = {2}/></Suspense>}
        </div>
    );
}