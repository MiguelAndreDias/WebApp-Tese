import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { Sidenav, Nav, Button } from 'rsuite';
import { useEffect, useState } from 'react';
import panelConfig from './configs/dashboardSkeleton.json'
import ItemsList from '../components/ItemsList';

export default function Home() {
  const [currentAdl, setCurrentAdl] = useState();
  const [openDropdowns, setOpenDropdowns] = useState();

  const updateUrl = (openTabs, selectedValue) => {
    let query = openTabs?.length > 0 ? ["open=" + openTabs.join(';')] : [];
    query = selectedValue ? ["value=" + selectedValue, ...query] : query;
    window.history.replaceState(window.history.state, window.title, window.location.pathname + (query.length > 0 ? `?${query.join('&')}` : ''));
  }

  useEffect(() => {
    let queryParams = new URLSearchParams(window.location.search);
    let value = queryParams.get('value');
    value && setCurrentAdl(decodeURIComponent(value));
    let open = queryParams.get('open');
    open && setOpenDropdowns(open.split(";").map(decodeURIComponent));
  }, [])

  useEffect(() => {
    updateUrl(openDropdowns, currentAdl);
  }, [currentAdl, openDropdowns])

  const onButtonSumbit = (ev, value) => {
    ev.stopPropagation();
    ev.preventDefault();
    setCurrentAdl(value);
  }

  const createButton = ([name, value], index) => (
    <Button appearance="subtle" block onClick={(ev) => onButtonSumbit(ev, value)} value={value} name="testar" key={index} active={value === currentAdl} type="button">
      {name}
    </Button>
  );

  const createNav = ({ name, subList, data }) => {
    if (!subList && !data) return <Nav.Item eventKey={name} key={name}>{name}</Nav.Item>;

    return (
      <Nav.Menu eventKey={name} title={name} key={name}>
        {data ? data.map(createButton) : subList.map(createNav)}
      </Nav.Menu>
    );
  }

  const onOpenChange = (ev) => {
    setOpenDropdowns(ev);
  }

  return (<>
    <Head>
      <title>This is my app!!!</title>
      <meta name="description" content="App desenvolvida no contexto da tese de mestrado" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>

      <Sidenav onOpenChange={onOpenChange} openKeys={openDropdowns} >
        <Sidenav.Body>
          <Nav activeKey="1">
            {panelConfig.map(createNav)}
          </Nav>
        </Sidenav.Body>
      </Sidenav>
      <section>
        <ItemsList repoAddress={currentAdl} />
      </section>
    </main>
  </>
  )
}
