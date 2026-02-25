export interface Card {
	type_code: string;
	type_name: string;
	card_set_code: string;
	card_set_name: string;
	faction_code: string;
	faction_hame: string;
	code: string;
	name: string;
	text: string;
	real_text: string;
	quantity: number;
	cost: number;
	resource_energy: number;
	resource_physical: number;
	resource_mental: number;
	resource_wild: number;
	deck_limit: number;
	is_unique: boolean;
	attack: number;
	attack_cost: number;
	thwart: number;
	thwart_cost: number;
	health: number;
	attack_star: boolean;
	thwart_star: boolean;
	defense_star: boolean;
	health_star: boolean;
	recover_star: boolean;
	scheme_star: boolean;
	boost_star: boolean;
	threat_star: boolean;
	url: string;
	imagesrc: string;
	duplicated_by: string[];
	traits: string;
	hidden: boolean;
	linked_to_code: string;

	
}