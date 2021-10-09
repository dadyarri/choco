import React from 'react';
import PropTypes from 'prop-types';

import { Panel, PanelHeader, Button, Div } from '@vkontakte/vkui';

const Home = ({ id, go }) => (
	<Panel id={id}>
		<PanelHeader>
			ChocoManager | Главная
		</PanelHeader>
		<Div>
			<Button stretched size="l" mode="secondary" onClick={go} data-to='leftovers'>
				Показать таблицу остатков
			</Button>
		</Div>
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Home;
