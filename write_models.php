<?php
// Generator script to write model files with proper dollar signs

 = <<<'PHP'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected  = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected  = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function claims()
    {
        return ->hasMany(Claim::class);
    }

    public function isAnalyst(): bool
    {
        return ->role === 'analyst';
    }

    public function isClient(): bool
    {
        return ->role === 'client';
    }
}
PHP;

 = <<<'PHP'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Claim extends Model
{
    use HasFactory;

    protected  = [
        'user_id',
        'claim_id',
        'client_name',
        'provider_name',
        'type',
        'amount',
        'status',
        'notes',
        'date_submitted',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'date_submitted' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return ->belongsTo(User::class);
    }

    public function documents(): HasMany
    {
        return ->hasMany(Document::class);
    }
}
PHP;

 = <<<'PHP'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    use HasFactory;

    protected  = [
        'claim_id',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
    ];

    public function claim(): BelongsTo
    {
        return ->belongsTo(Claim::class);
    }
}
PHP;

file_put_contents(__DIR__ . '/app/Models/User.php', );
file_put_contents(__DIR__ . '/app/Models/Claim.php', );
file_put_contents(__DIR__ . '/app/Models/Document.php', );

echo  Models written successfully!\n;
