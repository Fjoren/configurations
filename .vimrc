"	Color
set t_Co=256
set background=dark
colorscheme gruvbox	"Use default.vim colorscheme (forked in github)
syntax enable 		"Syntax highlighting

"	Spaces & Tabs
set wrap 			"Turns on textwrap
set linebreak 		"Only break on whitespace
set textwidth=0		"Wrapping is only visual
set tabstop=4		"Tabs are 4 spaces instead of 8
set shiftwidth=4

"	UI
set number			"Turns on line numbers
filetype indent on	"Filetype specific indentation
set wildmenu		"Clycle through tab complete options
set showmatch		"Matches open and close brackets, parens, etc.

"	Movement
nnoremap j gj		"Visual line movement
nnoremap k gk		
nnoremap l h
nnoremap ; l
