import React from 'react';

import { Panel, PanelHeader, PanelHeaderBack, CardGrid, Card, Group, Title, HorizontalCell, IconButton } from '@vkontakte/vkui';
import { Icon16Add, Icon16Minus } from '@vkontakte/icons';

import './Leftovers.css';

function incrementItem (itemId) {
	console.log("incremented: " + itemId);
}

const Leftovers = (id, go, fetchedList) => (
	<Panel id={id}>
		<PanelHeader
			left={<PanelHeaderBack onClick={() => go} data-to="home"/>}
		>
			ChocoManager | Остатки
		</PanelHeader>
		<Group mode="plain">
		<CardGrid>
			<Card>
				<HorizontalCell>
					<Title level="2" weight="semibold" style={{ marginBottom: 16, marginTop: 16, marginLeft: 16 }}>Молочный</Title>
					<IconButton onClick={ incrementItem(1) }><Icon16Add /></IconButton>
					<Title level="2" weight="semibold" style={{ marginBottom: 16, marginTop: 16}}>4</Title>
					<IconButton onClick={ incrementItem(1) }><Icon16Minus /></IconButton>
				</HorizontalCell>
			</Card>

			<Card>
				<HorizontalCell>
					<Title level="2" weight="semibold" style={{ marginBottom: 16, marginTop: 16, marginLeft: 16 }}>Молочный</Title>
					<IconButton onClick={ incrementItem(1) }><Icon16Add /></IconButton>
					<Title level="2" weight="semibold" style={{ marginBottom: 16, marginTop: 16}}>4</Title>
					<IconButton onClick={ incrementItem(1) }><Icon16Minus /></IconButton>
				</HorizontalCell>
			</Card>
		</CardGrid>
	</Group>
	</Panel>
);

export default Leftovers;
