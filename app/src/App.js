import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Leftovers from './panels/Leftovers';

const ROUTES = {
	HOME: 'home',
	LEFTOVERS: 'leftovers'
}

const App = () => {
	const [activePanel, setActivePanel] = useState(ROUTES.LEFTOVERS);
	const [fetchedList, setList] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_dark';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		function fetchData() {
			const data = {
				"items": [
					{
						"id": 1,
						"leftover": 10,
						"name": "Test2",
						"retail_price": 200,
						"wholesale_price": 100
					}
				]
			}
			setList(data);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<Home id={ROUTES.HOME} go={go} />
					<Leftovers id={ROUTES.LEFTOVERS} go={go} fetchedList={fetchedList}/>
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
